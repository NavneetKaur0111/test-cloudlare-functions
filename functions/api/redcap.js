export function onRequest(context) {
  const {request} = context;
  console.log(context)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  const API_URL = "https://redcap.ualberta.ca/api/";

  // The endpoint you want the CORS reverse proxy to be on
  const PROXY_ENDPOINT = "/corsproxy/";

  function rawHtmlResponse(html) {
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  }

  const DEMO_PAGE = `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>API GET without CORS Proxy</h1>
        <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful">Shows TypeError: Failed to fetch since CORS is misconfigured</a>
        <p id="noproxy-status"/>
        <code id="noproxy">Waiting</code>
        <h1>API GET with CORS Proxy</h1>
        <p id="proxy-status"/>
        <code id="proxy">Waiting</code>
        <h1>API POST with CORS Proxy + Preflight</h1>
        <p id="proxypreflight-status"/>
        <code id="proxypreflight">Waiting</code>
        <script>
        let reqs = {};
        reqs.noproxy = () => {
          return fetch("${API_URL}").then(r => r.json())
        }
        reqs.proxy = async () => {
          let href = "${PROXY_ENDPOINT}?apiurl=${API_URL}"
          return fetch(window.location.origin + href).then(r => r.json())
        }
        reqs.proxypreflight = async () => {
          let href = "${PROXY_ENDPOINT}?apiurl=${API_URL}"
          let response = await fetch(window.location.origin + href, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              msg: "Hello world!"
            })
          })
          return response.json()
        }
        (async () => {
        for (const [reqName, req] of Object.entries(reqs)) {
          try {
            let data = await req()
            document.getElementById(reqName).innerHTML = JSON.stringify(data)
          } catch (e) {
            document.getElementById(reqName).innerHTML = e
          }
        }
      })()
        </script>
      </body>
      </html>
    `;

  async function handleRequest(request) {

    // Rewrite request to point to API URL. This also makes the request mutable
    // so you can add the correct Origin header to make the API server think
    // that this request is not cross-site.
    const data = new FormData();
    data.append('token', 'ADA802DB63053AF0266EA18C2CBDDD6A');
    data.append('format', 'json');
    data.append('content', 'record');
    data.append('type', 'flat');
    data.append('data', JSON.stringify([{record_id: 'uygbkn'}]));
    request = new Request(API_URL, data);
    request.headers.set("Origin", new URL(API_URL).origin);
    let response = await fetch(request);
    // Recreate the response so you can modify the headers

    response = new Response(response.body, response);
    // Set CORS headers

    response.headers.set("Access-Control-Allow-Origin", '*');

    // Append to/Add Vary header so browser will cache response correctly
    response.headers.append("Vary", "Origin");

    return response;
  }

  async function handleOptions(request) {
    if (
      request.headers.get("Origin") !== null &&
      request.headers.get("Access-Control-Request-Method") !== null &&
      request.headers.get("Access-Control-Request-Headers") !== null
    ) {
      // Handle CORS preflight requests.
      return new Response(null, {
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Headers": request.headers.get(
            "Access-Control-Request-Headers"
          ),
        },
      });
    } else {
      // Handle standard OPTIONS request.
      return new Response(null, {
        headers: {
          Allow: "GET, HEAD, POST, OPTIONS",
        },
      });
    }
  }

  const url = new URL(request.url);
  // if (url.pathname.startsWith(PROXY_ENDPOINT)) {
  return handleRequest()
  // } else {
  //   return rawHtmlResponse(DEMO_PAGE);
  // }
}

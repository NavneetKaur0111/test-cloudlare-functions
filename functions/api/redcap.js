export function onRequest(request) {
  return fetch('https://redcap.ualberta.ca/api/', request)
}

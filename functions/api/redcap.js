export function onRequest(request) {
  return fetch('https://redcap.ualberta.ca/api/', {
    data: [{record_id: '1'}]
  })
}

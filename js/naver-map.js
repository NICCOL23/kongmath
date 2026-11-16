const mapPanel = document.querySelector('#academy-naver-map');
const mapCanvas = document.querySelector('#academy-map-canvas');
const mapPreview = document.querySelector('#academy-map-preview');
const clientId = mapPanel.dataset.naverClientId.trim();

if (clientId) {
  let authenticationFailed = false;

  window.navermap_authFailure = () => {
    authenticationFailed = true;
    mapCanvas.setAttribute('aria-hidden', 'true');
    mapPreview.hidden = false;
  };

  window.initAcademyNaverMap = () => {
    if (authenticationFailed) return;
    const position = new naver.maps.LatLng(35.1589987, 129.0507152);
    const map = new naver.maps.Map(mapCanvas, {
      center: position,
      zoom: 17,
      zoomControl: true,
      scrollWheel: false,
      draggable: false,
      pinchZoom: false
    });
    new naver.maps.Marker({ map, position, title: '공쌤수학원' });

    naver.maps.Event.addListener(map, 'tilesloaded', () => {
      if (authenticationFailed || !mapCanvas.querySelector('img')) return;
      mapCanvas.setAttribute('aria-hidden', 'false');
      mapPreview.hidden = true;
    });
  };

  const sdk = document.createElement('script');
  const sdkUrl = new URL('https://oapi.map.naver.com/openapi/v3/maps.js');
  sdkUrl.searchParams.set('ncpKeyId', clientId);
  sdkUrl.searchParams.set('callback', 'initAcademyNaverMap');
  sdk.src = sdkUrl.href;
  sdk.async = true;
  document.head.append(sdk);
}

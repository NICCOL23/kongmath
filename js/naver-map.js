const mapPanel = document.querySelector('#academy-naver-map');
const mapCanvas = document.querySelector('#academy-map-canvas');
const mapStatus = document.querySelector('#academy-map-status');
const clientId = mapPanel.dataset.naverClientId.trim();

if (clientId) {
  let authenticationFailed = false;

  const showFailure = () => {
    authenticationFailed = true;
    mapCanvas.setAttribute('aria-hidden', 'true');
    mapStatus.hidden = false;
    mapStatus.textContent = "지도를 불러오지 못했습니다. 위의 네이버 지도 버튼으로 위치를 확인해 주세요.";
  };

  window.navermap_authFailure = showFailure;

  const initializeMap = () => {
    if (authenticationFailed) return;
    const maps = window.naver?.maps;
    if (!maps?.Map) return showFailure();
    const position = new maps.LatLng(35.1589987, 129.0507152);
    const map = new maps.Map(mapCanvas, {
      center: position,
      zoom: 17,
      zoomControl: true,
      scrollWheel: false,
      draggable: false,
      pinchZoom: false
    });
    new maps.Marker({ map, position, title: '공쌤수학원' });

    maps.Event.addListener(map, 'tilesloaded', () => {
      if (authenticationFailed || !mapCanvas.querySelector('img')) return;
      mapCanvas.setAttribute('aria-hidden', 'false');
      mapStatus.hidden = true;
    });
  };

  const sdk = document.createElement('script');
  const sdkUrl = new URL('https://oapi.map.naver.com/openapi/v3/maps.js');
  sdkUrl.searchParams.set('ncpKeyId', clientId);
  sdk.src = sdkUrl.href;
  sdk.async = true;
  sdk.addEventListener('load', initializeMap, { once: true });
  sdk.addEventListener('error', showFailure, { once: true });
  document.head.append(sdk);
}

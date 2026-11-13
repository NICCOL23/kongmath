const mapPanel = document.querySelector('#academy-naver-map');
const mapStatus = document.querySelector('#academy-map-status');
const clientId = mapPanel.dataset.naverClientId.trim();

// Keep wheel gestures over the embedded map on the page scroll.
mapPanel.addEventListener('wheel', (event) => {
  event.stopImmediatePropagation();
}, { capture: true, passive: true });

if (clientId) {
  const sdk = document.createElement('script');
  const sdkUrl = new URL('https://oapi.map.naver.com/openapi/v3/maps.js');
  sdkUrl.searchParams.set('ncpKeyId', clientId);
  sdkUrl.searchParams.set('submodules', 'geocoder');
  sdkUrl.searchParams.set('callback', 'initAcademyNaverMap');

  const showError = () => {
    mapStatus.textContent = '지도를 불러오지 못했습니다. 네이버 지도에서 위치를 확인해 주세요.';
  };

  window.navermap_authFailure = showError;
  window.initAcademyNaverMap = () => {
    naver.maps.Service.geocode({ query: '부산광역시 부산진구 신천대로 192' }, (status, result) => {
      const address = result?.v2?.addresses?.[0];
      if (status !== naver.maps.Service.Status.OK || !address) {
        showError();
        return;
      }

      const position = new naver.maps.LatLng(Number(address.y), Number(address.x));
      const map = new naver.maps.Map(mapPanel, {
        center: position,
        zoom: 17,
        zoomControl: true,
        scrollWheel: false,
        draggable: false,
        pinchZoom: false
      });
      new naver.maps.Marker({ map, position, title: '공쌤수학원' });
    });
  };

  sdk.src = sdkUrl.href;
  sdk.async = true;
  sdk.onerror = showError;
  document.head.append(sdk);
}

let map;
let targetLocation;
let marker;

// サーバーからAPIキーを取得し、Google Maps APIをロード
async function loadGoogleMaps() {
  try {
    const response = await fetch('/api/myapi'); // APIキーを取得
    const data = await response.json();
    
    if (data.apiKey) {
      // APIキーでGoogle Mapsを動的にロード
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=geometry&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      console.error("Error: API key is missing");
      document.getElementById("score").textContent = "APIキーが取得できませんでした";
    }
  } catch (error) {
    console.error("APIリクエスト中にエラーが発生しました:", error);
    document.getElementById("score").textContent = "APIリクエスト中にエラーが発生しました";
  }
}

// 地図の初期設定
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.6895, lng: 139.6917 },
    zoom: 4,
  });

  targetLocation = {
    lat: 35.6812, // 東京駅
    lng: 139.7671
  };

  map.addListener("click", (event) => {
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
    calculateDistance(event.latLng);
  });
}

function calculateDistance(clickedLocation) {
  const userLatLng = new google.maps.LatLng(clickedLocation.lat(), clickedLocation.lng());
  const targetLatLng = new google.maps.LatLng(targetLocation.lat, targetLocation.lng);
  const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, targetLatLng);
  document.getElementById("score").textContent = `スコア: ${Math.round(distance)} メートル`;
}

function resetGame() {
  if (marker) marker.setMap(null);
  document.getElementById("score").textContent = "スコア: -";
}

// Google Mapsのロードを初期化
loadGoogleMaps();

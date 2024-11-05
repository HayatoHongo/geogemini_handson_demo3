let map;
let targetLocation;  // 正解の場所
let marker;          // ユーザーのピン

// 初期設定: 地図を表示
function initMap() {
  // 地図の表示と初期設定
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.6895, lng: 139.6917 }, // 東京を中央に設定
    zoom: 4,
  });

  // 正解の場所をランダムに設定（例として東京駅を使用）
  targetLocation = {
    lat: 35.6812, // 東京駅
    lng: 139.7671
  };

  // 地図クリック時にピンを立てるイベント
  map.addListener("click", (event) => {
    if (marker) marker.setMap(null); // 既存のマーカーがあれば消す
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
    calculateDistance(event.latLng); // 距離計算
  });
}

// ユーザーのピンと正解の場所の距離を計算
function calculateDistance(clickedLocation) {
  const userLatLng = new google.maps.LatLng(clickedLocation.lat(), clickedLocation.lng());
  const targetLatLng = new google.maps.LatLng(targetLocation.lat, targetLocation.lng);

  // 距離を計算し、結果を表示
  const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, targetLatLng);
  document.getElementById("score").textContent = `スコア: ${Math.round(distance)} メートル`;
}

// ゲームをリセットする
function resetGame() {
  if (marker) marker.setMap(null); // ピンを消す
  document.getElementById("score").textContent = "スコア: -";
}

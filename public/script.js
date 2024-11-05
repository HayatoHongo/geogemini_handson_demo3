let map;
let targetLocation;  // 正解の場所
let marker;          // ユーザーのピン

// 初期設定: 地図を表示
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.6895, lng: 139.6917 }, // 東京を中央に設定
    zoom: 4,
  });

  // 正解の場所をランダムに設定
  targetLocation = {
    lat: 35.6812, // 例: 東京駅
    lng: 139.7671
  };

  // ユーザーが地図をクリックした時にピンを立てる
  map.addListener("click", (event) => {
    if (marker) marker.setMap(null); // 既存のマーカーがあれば消す
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
    calculateDistance(event.latLng);
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

// ページロード時にGoogle Mapsの初期化
document.addEventListener("DOMContentLoaded", async () => {
  // サーバーサイドAPIから地図の初期データを取得する
  try {
    const response = await fetch('/api/myapi?address=Tokyo'); // 例として"Tokyo"を指定
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.message); // "API response from server" が表示されるはず

    // Google Mapsのスクリプトが読み込まれてからinitMapを呼び出す
    if (typeof google !== 'undefined') {
      initMap();
    } else {
      console.error("Google Maps APIが読み込まれていません。");
    }
  } catch (error) {
    console.error("APIリクエスト中にエラーが発生しました:", error);
  }
});

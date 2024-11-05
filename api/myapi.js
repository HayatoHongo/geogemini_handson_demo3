export default async function handler(req, res) {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;  // Vercelの環境変数からAPIキーを取得
    const address = req.query.address;

    // APIキーの確認
    if (!API_KEY) {
        console.error("Error: API key is missing");
        return res.status(500).json({ error: 'API key is missing' });
    }

    // アドレスがない場合はAPIキーだけを返す
    if (!address) {
        console.log("Info: Address parameter is missing, returning API key only");
        return res.status(200).json({ apiKey: API_KEY });
    }

    try {
        // Google Maps APIでジオコーディングを行う
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
        console.log("Info: Fetching from Google Maps API with URL:", geocodeUrl);

        const response = await fetch(geocodeUrl);

        // レスポンスが成功かどうかチェック
        if (!response.ok) {
            console.error("Error: Failed to fetch from Google Maps API:", response.statusText);
            return res.status(response.status).json({ error: 'Failed to fetch from Google Maps API', statusText: response.statusText });
        }

        const data = await response.json();
        console.log("Info: Received response from Google Maps API:", data);

        // APIレスポンスのステータス確認
        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            console.log("Info: Geocoding successful, returning location:", location);
            return res.status(200).json({ location });
        } else {
            console.error("Error: Geocoding failed with status:", data.status);
            return res.status(500).json({ error: 'Geocoding failed', status: data.status });
        }
    } catch (error) {
        console.error("Error in API handler:", error.message, error.stack);
        return res.status(500).json({ error: 'Failed to fetch location data', details: error.message });
    }
}

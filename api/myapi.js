export default async function handler(req, res) {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const address = req.query.address;

    if (!API_KEY) {
        console.error("Error: API key is missing");
        return res.status(500).json({ error: 'API key is missing' });
    }

    // APIキーを返すための処理
    if (!address) {
        return res.status(200).json({ apiKey: API_KEY });
    }

    try {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
        const response = await fetch(geocodeUrl);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch from Google Maps API!' });
        }

        const data = await response.json();

        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            return res.status(200).json({ location });
        } else {
            return res.status(500).json({ error: 'Geocoding failed', status: data.status });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch location data', details: error.message });
    }
}

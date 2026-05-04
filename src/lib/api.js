const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches shops within a specified radius from the backend.
 * @param {number} lat - Latitude of the search center.
 * @param {number} lng - Longitude of the search center.
 * @param {number} [radius=40000] - Search radius in meters (default 40km).
 * @returns {Promise<Array>} - A promise that resolves to an array of shops.
 */
export async function getNearbyShops(lat, lng, radius = 40000) {
    try {
        const url = `${API_BASE_URL}/api/shops?lat=${lat}&lng=${lng}&radius=${radius}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Fetch error in getNearbyShops:", error);
        throw error;
    }
}

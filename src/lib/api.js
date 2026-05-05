const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * --- CATEGORY API ---
 */
export async function getCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
    } catch (error) {
        console.error("Fetch Error in getCategories:", error);
        return [];
    }
}

/**
 * --- AUTH API ---
 */
export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
}

export async function signup(fullName, email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');
    return data;
}

export async function verifyOTP(email, otp) {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Verification failed');
    return data;
}

export async function getUserProfile(token) {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data;
}

/**
 * --- SHOP API ---
 */
export async function getNearbyShops(lat, lng, radius = 40000) {
    try {
        const url = `${API_BASE_URL}/api/shops?lat=${lat}&lng=${lng}&radius=${radius}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Fetch error in getNearbyShops:", error);
        throw error;
    }
}

/**
 * --- EXTERNAL APIS ---
 */
export async function reverseGeocode(lat, lon) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    if (!response.ok) throw new Error("Failed to detect city");
    return response.json();
}

/**
 * --- ADMIN API ---
 */
export async function getAdminStats(token) {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Admin stats fetch failed');
    return response.json();
}

export async function getPendingShops(token) {
    const response = await fetch(`${API_BASE_URL}/api/admin/pending-shops`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Pending shops fetch failed');
    return response.json();
}

export async function approveShop(token, shopId) {
    const response = await fetch(`${API_BASE_URL}/api/admin/approve-shop/${shopId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Approval failed');
    return data;
}
export async function getAllShops(token) {
    const response = await fetch(`${API_BASE_URL}/api/admin/all-shops`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('All shops fetch failed');
    return response.json();
}

export async function getAllUsers(token) {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Users fetch failed');
    return response.json();
}

export async function deleteShop(token, shopId) {
    const response = await fetch(`${API_BASE_URL}/api/admin/shop/${shopId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Deletion failed');
    return data;
}

export async function deleteUser(token, userId) {
    const response = await fetch(`${API_BASE_URL}/api/admin/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'User deletion failed');
    return data;
}

const API_URL = "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan");
    }

    return data;
}

export const register = async (userData) => {
    return request("/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

export const login = async (credentials) => {
    return request("/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
};

export const logout = async () => {
    return request("/logout", {
        method: "POST",
    });
};

export const getContacts = async () => {
    return request("/contacts");
};

export const getContact = async (id) => {
    return request(`/contacts/${id}`);
};

export const createContact = async (contactData) => {
    return request("/contacts", {
        method: "POST",
        body: JSON.stringify(contactData),
    });
};

export const updateContact = async (id, contactData) => {
    return request(`/contacts/${id}`, {
        method: "PUT",
        body: JSON.stringify(contactData),
    });
};

export const deleteContact = async (id) => {
    return request(`/contacts/${id}`, {
        method: "DELETE",
    });
};
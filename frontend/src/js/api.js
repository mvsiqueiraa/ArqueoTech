const API_URL = 'http://localhost:5000/api';

const api = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    },

    register: async (name, email, password, institution) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, institution })
        });
        return response.json();
    },

    saveAnalysis: async (imageUrl, predictions) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ imageUrl, predictions })
        });
        return response.json();
    }
};

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

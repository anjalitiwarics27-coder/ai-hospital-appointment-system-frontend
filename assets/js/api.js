/* =====================================
   AI DOCTOR SYSTEM - API.JS (STABLE FIXED VERSION)
===================================== */

/* =========================
   BASE CONFIG (from config.js)
   Change URL only in assets/js/config.js
========================= */
const API_BASE = window.API_BASE_URL || "https://ai-hospital-appointment-system-backend-production.up.railway.app/api";

/* =========================
   TOKEN HANDLER
========================= */
function getToken() {
    return localStorage.getItem("token");
}

function saveToken(token) {
    localStorage.setItem("token", token);
}

function removeToken() {
    localStorage.removeItem("token");
}

/* =========================
   SAFE FETCH WRAPPER (IMPROVED)
========================= */
async function apiRequest(endpoint, method = "GET", data = null) {
    try {
        const token = getToken();
        const url = API_BASE + endpoint;

        console.log("📡 API CALL:", method, url);

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        // token only if exists
        if (token) {
            options.headers["Authorization"] = "Bearer " + token;
        }

        // body only if needed
        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        // safer JSON handling
        let result;
        const text = await response.text();

        try {
            result = text ? JSON.parse(text) : {};
        } catch (e) {
            console.error("❌ Invalid JSON from server:", text);
            return {
                success: false,
                message: "Invalid server response"
            };
        }

        if (!response.ok) {
            console.error("❌ BACKEND ERROR:", result);

            return {
                success: false,
                status: response.status,
                message: result?.message || "Request failed",
                full: result
            };
        }

        return result;

    } catch (error) {
        console.error("❌ NETWORK ERROR:", error.message);

        return {
            success: false,
            message: "Server not responding"
        };
    }
}

/* =========================
   AUTH APIs
========================= */
async function loginAPI(email, password) {
    const result = await apiRequest("/auth/login", "POST", {
        email,
        password
    });

    if (result?.success && result?.token) {
        saveToken(result.token);
    }

    return result;
}

async function signupAPI(userData) {
    return await apiRequest("/auth/signup", "POST", userData);
}

/* =========================
   DOCTOR APIs
========================= */
const getDoctorsAPI = () => apiRequest("/doctors");

const createDoctorAPI = (data) =>
    apiRequest("/doctors/create", "POST", data);

const updateDoctorAPI = (id, data) =>
    apiRequest(`/doctors/update/${id}`, "PUT", data);

const deleteDoctorAPI = (id) =>
    apiRequest(`/doctors/delete/${id}`, "DELETE");

/* =========================
   PATIENT APIs
========================= */
const getPatientsAPI = () => apiRequest("/patients");

const createPatientAPI = (data) =>
    apiRequest("/patients/create", "POST", data);

const updatePatientAPI = (id, data) =>
    apiRequest(`/patients/update/${id}`, "PUT", data);

const deletePatientAPI = (id) =>
    apiRequest(`/patients/delete/${id}`, "DELETE");

/* =========================
   APPOINTMENT APIs
========================= */
const bookAppointmentAPI = (data) =>
    apiRequest("/appointments/book", "POST", data);

const getAppointmentsAPI = (id) =>
    apiRequest(`/appointments/${id}`);

/* =========================
   CHAT APIs
========================= */
const sendMessageAPI = (data) =>
    apiRequest("/chat/send", "POST", data);

/* =========================
   HEALTH CHECK
========================= */
const healthCheck = () =>
    apiRequest("/test-public");

/* =========================
   LOGOUT
========================= */
function logout() {
    removeToken();
    // Works from root and from pages/*/ subfolders
    window.location.href = window.location.pathname.includes("/pages/")
        ? "../../index.html"
        : "index.html";
}

/* =========================
   GLOBAL EXPORT
========================= */
window.API = {
    loginAPI,
    signupAPI,
    getDoctorsAPI,
    createDoctorAPI,
    updateDoctorAPI,
    deleteDoctorAPI,
    getPatientsAPI,
    createPatientAPI,
    updatePatientAPI,
    deletePatientAPI,
    bookAppointmentAPI,
    getAppointmentsAPI,
    sendMessageAPI,
    healthCheck,
    logout
};

/* =========================
   INIT CHECK (SAFE)
========================= */
window.addEventListener("load", async () => {
    console.log("🌐 Frontend Loaded");

    try {
        const status = await healthCheck();
        console.log("✅ Backend Status:", status);
    } catch (err) {
        console.error("❌ Backend not reachable");
    }
});
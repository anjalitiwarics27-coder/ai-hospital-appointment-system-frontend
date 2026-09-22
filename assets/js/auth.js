import API_BASE from "./api.js";

/* =========================
   VALIDATION HELPERS
========================= */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
    return password && password.length >= 6;
}

/* =========================
   UI MESSAGE
========================= */
function showAuthMessage(message, type = "error") {

    const box = document.createElement("div");
    box.innerText = message;

    Object.assign(box.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "12px 16px",
        borderRadius: "10px",
        color: "#fff",
        fontSize: "14px",
        zIndex: "9999",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
    });

    box.style.background =
        type === "success" ? "#28a745" :
        type === "warning" ? "#ff9800" : "#dc3545";

    document.body.appendChild(box);

    setTimeout(() => box.remove(), 3000);
}

/* =========================
   API CALL (FIXED)
========================= */
async function apiCall(url, method = "POST", data = null) {

    try {
        const res = await fetch(`${API_BASE}${url}`, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: data ? JSON.stringify(data) : null
        });

        return await res.json();

    } catch (err) {
        return {
            success: false,
            message: "Server not reachable ❌"
        };
    }
}

/* =========================
   SIGNUP
========================= */
async function handleSignup(event) {
    event.preventDefault();

    const name = document.querySelector("#name")?.value.trim();
    const email = document.querySelector("#email")?.value.trim();
    const password = document.querySelector("#password")?.value.trim();
    const role = document.querySelector("#role")?.value || "patient";

    if (!name || !email || !password) {
        return showAuthMessage("All fields required ❌");
    }

    if (!isValidEmail(email)) {
        return showAuthMessage("Invalid email ❌");
    }

    if (!isStrongPassword(password)) {
        return showAuthMessage("Password too weak ❌");
    }

    const result = await apiCall("/auth/signup", "POST", {
        name, email, password, role
    });

    if (result.success) {
        showAuthMessage("Signup successful ✔", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);

    } else {
        showAuthMessage(result.message || "Signup failed ❌");
    }
}

/* =========================
   LOGIN
========================= */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.querySelector("#email")?.value.trim();
    const password = document.querySelector("#password")?.value.trim();
    const role = document.querySelector("#role")?.value;

    if (!email || !password) {
        return showAuthMessage("Fill all fields ❌");
    }

    const result = await apiCall("/auth/login", "POST", {
        email, password, role
    });

    if (result.success) {

        showAuthMessage("Login successful ✔", "success");

        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        setTimeout(() => {
            if (result.user.role === "doctor") {
                window.location.href = "doctor/doctor_dashboard.html";
            } else {
                window.location.href = "patient/patient_dashboard.html";
            }
        }, 1200);

    } else {
        showAuthMessage(result.message || "Login failed ❌");
    }
}

/* =========================
   LOGOUT
========================= */
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    showAuthMessage("Logged out ✔", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

/* =========================
   PROTECT ROUTES
========================= */
function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../login.html";
    }
}

/* =========================
   INIT
========================= */
window.addEventListener("load", () => {
    console.log("🔐 Auth System Connected with Backend");
});

/* =========================
   EXPORT (optional if using modules)
========================= */
export { handleSignup, handleLogin, logout, checkAuth };
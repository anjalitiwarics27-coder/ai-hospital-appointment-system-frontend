/* API_ROOT comes from assets/js/config.js (base without /api) */
const API_BASE = window.API_ROOT || window.API_BASE_URL || "http://localhost:5001";

/* =========================
   AUTH CHECK
========================= */
function checkDoctorAuth() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        window.location.href = "../../index.html";
        return;
    }

    if (user.role !== "doctor") {
        alert("Access denied ❌ Doctors only");
        window.location.href = "../../index.html";
    }
}

/* =========================
   LOAD DOCTOR INFO
========================= */
function loadDoctorInfo() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const nameEl = document.querySelector("#doctorName");
    const emailEl = document.querySelector("#doctorEmail");

    if (nameEl) nameEl.innerText = user.name;
    if (emailEl) emailEl.innerText = user.email;
}

/* =========================
   API CALL
========================= */
async function apiCall(url, method = "GET", data = null) {

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_BASE}${url}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: "Bearer " + token })
            },
            body: data ? JSON.stringify(data) : null
        });

        return await res.json();

    } catch (err) {
        return { success: false, message: "Server error ❌" };
    }
}

/* =========================
   LOAD APPOINTMENTS (REAL)
========================= */
async function loadAppointments() {

    const container = document.querySelector("#appointmentsList");
    if (!container) return;

    const user = JSON.parse(localStorage.getItem("user"));

    const result = await apiCall(`/api/appointments/doctor/${user.id}`);

    container.innerHTML = "";

    if (!result.success) return;

    result.data.forEach(app => {

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>Patient ID: ${app.patient_id}</h3>
            <p><b>Date:</b> ${app.date}</p>
            <p><b>Time:</b> ${app.time}</p>
            <p><b>Symptoms:</b> ${app.symptoms || "N/A"}</p>
            <p><b>Status:</b> ${app.status}</p>

            <button onclick="updateStatus(${app.id}, 'Completed')">Complete</button>
            <button onclick="updateStatus(${app.id}, 'Cancelled')">Cancel</button>
        `;

        container.appendChild(div);
    });
}

/* =========================
   UPDATE STATUS
========================= */
async function updateStatus(id, status) {

    const result = await apiCall(
        `/api/appointments/status/${id}`,
        "PUT",
        { status }
    );

    showDoctorAlert(result.message, result.success ? "success" : "error");

    loadAppointments();
}

/* =========================
   LOAD PATIENTS (REAL)
========================= */
async function loadPatients() {

    const container = document.querySelector("#patientList");
    if (!container) return;

    const result = await apiCall("/api/patients");

    container.innerHTML = "";

    if (!result.success) return;

    result.data.forEach(p => {

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.email}</p>
            <p>Age: ${p.age}</p>
            <p>Gender: ${p.gender}</p>
        `;

        container.appendChild(div);
    });
}

/* =========================
   PRESCRIPTION (REAL SAVE)
========================= */
async function createPrescription(event) {

    event.preventDefault();

    const patient = document.querySelector("#patient")?.value;
    const diagnosis = document.querySelector("#diagnosis")?.value;
    const medicines = document.querySelector("#medicines")?.value;

    if (!patient || !diagnosis) {
        return showDoctorAlert("Fill required fields ❌", "error");
    }

    const result = await apiCall("/api/prescriptions/create", "POST", {
        patient,
        diagnosis,
        medicines
    });

    showDoctorAlert(result.message, result.success ? "success" : "error");

    event.target.reset();
}

/* =========================
   LOAD PRESCRIPTIONS
========================= */
async function loadPrescriptions() {

    const container = document.querySelector("#prescriptionList");
    if (!container) return;

    const user = JSON.parse(localStorage.getItem("user"));

    const result = await apiCall(`/api/prescriptions/${user.id}`);

    container.innerHTML = "";

    if (!result.success) return;

    result.data.forEach(p => {

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${p.patient}</h3>
            <p>${p.date}</p>
            <p>${p.diagnosis}</p>
            <p>${p.medicines}</p>
        `;

        container.appendChild(div);
    });
}

/* =========================
   CHAT (SIMPLE UI)
========================= */
function sendDoctorMessage() {

    const input = document.querySelector("#chatInput");
    const box = document.querySelector("#chatBox");

    if (!input || !box) return;

    const msg = input.value.trim();
    if (!msg) return;

    const div = document.createElement("div");
    div.className = "bubble right";
    div.innerText = msg;

    box.appendChild(div);

    input.value = "";
    box.scrollTop = box.scrollHeight;

    // fake reply
    setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "bubble left";
        reply.innerText = "Patient seen ✔";

        box.appendChild(reply);
        box.scrollTop = box.scrollHeight;
    }, 1000);
}

/* =========================
   ALERT
========================= */
function showDoctorAlert(message, type = "info") {

    const box = document.createElement("div");

    box.innerText = message;

    Object.assign(box.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "12px 16px",
        borderRadius: "10px",
        color: "#fff",
        zIndex: "9999"
    });

    box.style.background =
        type === "success" ? "#28a745" :
        type === "error" ? "#dc3545" : "#17a2b8";

    document.body.appendChild(box);

    setTimeout(() => box.remove(), 3000);
}

/* =========================
   INIT
========================= */
window.addEventListener("load", () => {

    console.log("👨‍⚕️ Doctor Dashboard Loaded (Backend Mode)");

    checkDoctorAuth();
    loadDoctorInfo();
    loadAppointments();
    loadPatients();
    loadPrescriptions();
});
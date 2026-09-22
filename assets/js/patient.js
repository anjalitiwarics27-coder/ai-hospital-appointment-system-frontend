/* =====================================
   AI DOCTOR SYSTEM - PATIENT.JS
   Patient Dashboard Logic (CLEAN VERSION)
===================================== */

/* =========================
   SAFE SESSION PARSE
========================= */
function getSession() {
    try {
        return JSON.parse(localStorage.getItem("ai_doctor_session"));
    } catch (e) {
        return null;
    }
}

/* =========================
   CHECK PATIENT AUTH
========================= */
function checkPatientAuth() {
    const session = getSession();

    if (!session) {
        window.location.href = "../login.html";
        return;
    }

    if (session.role !== "patient") {
        alert("Access denied ❌ Only patients allowed");
        window.location.href = "../login.html";
    }
}

/* =========================
   LOAD PATIENT INFO
========================= */
function loadPatientInfo() {
    const session = getSession();
    if (!session) return;

    const nameEl = document.querySelector("#patientName");
    const emailEl = document.querySelector("#patientEmail");

    if (nameEl) nameEl.innerText = session.name || "Patient";
    if (emailEl) emailEl.innerText = session.email || "N/A";
}

/* =========================
   BOOK APPOINTMENT
========================= */
function bookAppointment(event) {
    event.preventDefault();

    const doctor = document.querySelector("#doctor")?.value?.trim();
    const date = document.querySelector("#date")?.value;
    const time = document.querySelector("#time")?.value;
    const symptoms = document.querySelector("#symptoms")?.value?.trim();

    if (!doctor || !date || !time) {
        showPatientAlert("Please fill required fields ❌", "error");
        return;
    }

    const appointment = {
        doctor,
        date,
        time,
        symptoms: symptoms || "N/A",
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push(appointment);

    localStorage.setItem("appointments", JSON.stringify(appointments));

    showPatientAlert("Appointment booked successfully ✔", "success");

    event.target.reset();

    loadAppointments();
}

/* =========================
   LOAD APPOINTMENTS
========================= */
function loadAppointments() {
    const container = document.querySelector("#appointmentsList");
    if (!container) return;

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    container.innerHTML = "";

    appointments.forEach((app, index) => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>Doctor: ${app.doctor}</h3>
            <p><b>Date:</b> ${app.date}</p>
            <p><b>Time:</b> ${app.time}</p>
            <p><b>Status:</b> ${app.status}</p>
            <p><b>Symptoms:</b> ${app.symptoms}</p>

            <button onclick="cancelAppointment(${index})">Cancel</button>
        `;

        container.appendChild(div);
    });
}

/* =========================
   CANCEL APPOINTMENT
========================= */
function cancelAppointment(index) {
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    if (index < 0 || index >= appointments.length) return;

    appointments.splice(index, 1);

    localStorage.setItem("appointments", JSON.stringify(appointments));

    showPatientAlert("Appointment cancelled ✔", "success");

    loadAppointments();
}

/* =========================
   CHAT SYSTEM
========================= */
function sendPatientMessage() {
    const input = document.querySelector("#chatInput");
    const box = document.querySelector("#chatBox");

    if (!input || !box) return;

    const msg = input.value.trim();
    if (!msg) return;

    const userMsg = document.createElement("div");
    userMsg.className = "bubble right";
    userMsg.innerText = msg;

    box.appendChild(userMsg);

    input.value = "";
    box.scrollTop = box.scrollHeight;

    setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "bubble left";
        reply.innerText = "Doctor will reply soon 👨‍⚕️";

        box.appendChild(reply);
        box.scrollTop = box.scrollHeight;
    }, 1200);
}

/* =========================
   LOAD REPORTS
========================= */
function loadReports() {
    const container = document.querySelector("#reportsList");
    if (!container) return;

    const reports = JSON.parse(localStorage.getItem("reports")) || [];

    container.innerHTML = "";

    if (reports.length === 0) {
        container.innerHTML = "<p>No reports available</p>";
        return;
    }

    reports.forEach(rep => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${rep.title || "Report"}</h3>
            <p>${rep.date || "-"}</p>
            <p><b>Status:</b> ${rep.status || "N/A"}</p>
            <div class="box">${rep.description || ""}</div>
        `;

        container.appendChild(div);
    });
}

/* =========================
   ALERT SYSTEM
========================= */
function showPatientAlert(message, type = "info") {
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

    if (type === "success") box.style.background = "#28a745";
    else if (type === "error") box.style.background = "#dc3545";
    else box.style.background = "#17a2b8";

    document.body.appendChild(box);

    setTimeout(() => box.remove(), 3000);
}

/* =========================
   INIT PATIENT PAGE
========================= */
window.addEventListener("load", function () {
    console.log("🧑‍⚕️ Patient System Loaded (Clean Version)");

    checkPatientAuth();
    loadPatientInfo();
    loadAppointments();
    loadReports();
});
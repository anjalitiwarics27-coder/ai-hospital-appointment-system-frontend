/* =====================================
   AI DOCTOR SYSTEM - MAIN.JS
   Global Frontend Logic (CLEAN VERSION)
===================================== */

/* =========================
   ALERT SYSTEM (IMPROVED)
========================= */
function showAlert(message, type = "info") {
    const alertBox = document.createElement("div");

    alertBox.innerText = message;

    alertBox.style.position = "fixed";
    alertBox.style.top = "20px";
    alertBox.style.right = "20px";
    alertBox.style.padding = "12px 16px";
    alertBox.style.borderRadius = "10px";
    alertBox.style.color = "#fff";
    alertBox.style.fontSize = "14px";
    alertBox.style.zIndex = "9999";
    alertBox.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
    alertBox.style.transition = "all 0.3s ease";

    const colors = {
        success: "#28a745",
        error: "#dc3545",
        warning: "#ff9800",
        info: "#17a2b8"
    };

    alertBox.style.background = colors[type] || colors.info;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.opacity = "0";
        alertBox.style.transform = "translateY(-10px)";
    }, 2500);

    setTimeout(() => alertBox.remove(), 3000);
}

/* =========================
   SIDEBAR TOGGLE
========================= */
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    sidebar.classList.toggle("collapsed");
}

/* =========================
   AUTO FORM HANDLING (SAFE FIX)
========================= */
document.addEventListener("submit", function (e) {
    const form = e.target;

    if (form.tagName === "FORM") {
        e.preventDefault();

        showAlert("Form submitted ✔", "success");

        // optional reset (safe check)
        if (typeof form.reset === "function") {
            form.reset();
        }
    }
});

/* =========================
   CHAT SYSTEM (FIXED)
========================= */
function sendMessage(inputSelector, messageBoxSelector) {
    const input = document.querySelector(inputSelector);
    const box = document.querySelector(messageBoxSelector);

    if (!input || !box) return;

    const message = input.value.trim();
    if (!message) return;

    // USER MESSAGE
    const msgDiv = document.createElement("div");
    msgDiv.className = "bubble right";
    msgDiv.innerText = message;

    box.appendChild(msgDiv);

    input.value = "";
    box.scrollTop = box.scrollHeight;

    // FAKE REPLY (can replace with backend later)
    setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "bubble left";
        reply.innerText = "Doctor will respond soon 👨‍⚕️";

        box.appendChild(reply);
        box.scrollTop = box.scrollHeight;
    }, 1000);
}

/* =========================
   SEARCH FILTER (IMPROVED)
========================= */
function filterCards(inputSelector, cardSelector) {
    const input = document.querySelector(inputSelector);

    if (!input) return;

    input.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        const cards = document.querySelectorAll(cardSelector);

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(value) ? "block" : "none";
        });
    });
}

/* =========================
   BUTTON LOADER (SAFE)
========================= */
function setLoading(button, isLoading = true) {
    if (!button) return;

    if (isLoading) {
        button.dataset.originalText = button.innerText;
        button.innerText = "Loading...";
        button.disabled = true;
    } else {
        button.innerText = button.dataset.originalText || "Submit";
        button.disabled = false;
    }
}

/* =========================
   MOCK API (KEEP FOR FUTURE)
========================= */
async function fakeApiCall(data) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, data });
        }, 800);
    });
}

/* =========================
   CHAT BUTTON SUPPORT (FIXED)
========================= */
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("send")) {
        const input = e.target.closest(".chat-box")?.querySelector("input");

        if (input) {
            input.dispatchEvent(new Event("input"));
        }
    }
});

/* =========================
   PAGE INIT
========================= */
window.addEventListener("load", function () {
    console.log("🚀 AI Doctor System Loaded Successfully");

    showAlert("Welcome to AI Doctor System 👨‍⚕️", "success");
});
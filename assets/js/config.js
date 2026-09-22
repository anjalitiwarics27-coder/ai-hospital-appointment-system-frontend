/* =====================================
   CENTRAL API CONFIG - Change URL here only
   For local: http://localhost:5001/api
   For live backend (Render/Railway/etc):
   e.g. https://your-backend.onrender.com/api
===================================== */
const API_BASE_URL = "http://localhost:5001/api";

// Make available globally (for normal <script> pages)
window.API_BASE_URL = API_BASE_URL;
// Root without /api (for files that already add /api/... in endpoint)
window.API_ROOT = API_BASE_URL.replace(/\/api\/?$/, "");
// Aliases for old code compatibility
window.API_BASE = API_BASE_URL;
window.BACKEND_URL = API_BASE_URL;

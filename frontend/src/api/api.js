const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("cipherstudio_token");
}

function headers(isJson = true) {
  const hdr = {};
  if (isJson) hdr["Content-Type"] = "application/json";
  const token = getToken();
  if (token) hdr["Authorization"] = `Bearer ${token}`;
  return hdr;
}

export async function apiFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const init = {
    credentials: "include",
    headers: headers(opts.json !== false),
    ...opts,
  };
  if (opts.body && typeof opts.body === "object" && init.headers["Content-Type"] === "application/json") {
    init.body = JSON.stringify(opts.body);
  }
  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
  const error = new Error("Request failed");
  error.status = res.status;
  error.data = data;
  throw error;
}
  return data;
}

export function setUrl(url: string) {
  window.localStorage.setItem("hhd_url", url);
}

export function getUrl() {
  return window.localStorage.getItem("hhd_url") || "http://localhost:5335";
}

export function setToken(token: string) {
  window.localStorage.setItem("hhd_token", token);
}

export function getToken() {
  return window.localStorage.getItem("hhd_token") || "";
}

export function setLoggedIn() {
  window.localStorage.setItem("hhd_logged_in", "true");
}

export function isLoggedIn() {
  return window.localStorage.getItem("hhd_logged_in") === "true";
}

export function clearLoggedIn() {
  window.localStorage.setItem("hhd_logged_in", "false");
}

function isLocalhost() {
  const url = getUrl();
  return !url || url.includes("localhost");
}

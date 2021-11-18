function getToken() {
  return localStorage.getItem("token");
}

function existsToken() {
  return getToken() !== null;
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

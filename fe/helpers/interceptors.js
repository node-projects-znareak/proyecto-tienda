axios.interceptors.request.use((req) => {
  if (existsToken()) {
    req.headers.authorization = "Bearer " + getToken();
  } else {
    alert("Tu sesión caducó o no puedes hacer esta acción");
    setToken("");
    window.location.href = "/";
  }
  return req;
});

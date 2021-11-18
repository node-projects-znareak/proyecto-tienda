axios.interceptors.request.use((req) => {
  if (existsToken()) {
    req.headers.authorization = "Bearer " + getToken();
  }
  return req;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status) {
      alert("Tu sesión caducó o no estás logeado.");
      window.location.href = "/login.html";
    }
  }
);

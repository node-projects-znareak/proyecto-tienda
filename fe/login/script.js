document.addEventListener("DOMContentLoaded", () => {
  const noRegister = document.getElementById("no-register");
  const registered = document.getElementById("registered");

  const formLogin = document.getElementById("login-form");
  const formRegister = document.getElementById("register-form");

  noRegister.addEventListener("click", () => {
    formLogin.classList.add("f-hidden");
    formRegister.classList.remove("f-hidden");
  });

  registered.addEventListener("click", () => {
    formLogin.classList.remove("f-hidden");
    formRegister.classList.add("f-hidden");
  });

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const data = { email, password };

    try {
      const res = await axios.post("/api/auth/login", data);
      alert("Datos correctos!");
      setToken(res.data?.data?.token);
      window.location.href = "/index.html";
    } catch (error) {
      if (error.response) {
        if (error.response.data?.error) {
          alert(error.response.data.data);
        }
      } else {
        alert("Error desconocido, intente más tarde");
      }
    }
  });

  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;
    const name = e.target.name.value;

    const data = { email, password, passwordConfirm, name };
    try {
      const res = await axios.post("/api/auth/signup", data);
      alert("Usuario registrado!");
      window.location.href = "/login";
    } catch (error) {
      if (error.response) {
        if (error.response.data?.error) {
          alert(error.response.data.data);
        }
      } else {
        alert("Error desconocido, intente más tarde");
      }
    }
  });
});

const email = document.querySelector('[data-testid="email"]');
const password = document.querySelector('[data-testid="password"]');
const btn = document.querySelector('[data-testid="login-btn"]');
const error = document.querySelector('[data-testid="error"]');

btn.addEventListener("click", async () => {
  error.textContent = "";
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: email.value, password: password.value }),
  });

  if (!res.ok) {
    error.textContent = "Login failed";
    return;
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  window.location.href = "/todos.html";
});
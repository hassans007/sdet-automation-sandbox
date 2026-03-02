const token = localStorage.getItem("token");
const list = document.querySelector('[data-testid="todo-list"]');
const status = document.querySelector('[data-testid="status"]');
const newTodo = document.querySelector('[data-testid="new-todo"]');
const addBtn = document.querySelector('[data-testid="add-btn"]');

if (!token) window.location.href = "/";

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
  return res;
}

async function load() {
  const res = await api("/api/todos");
  const todos = await res.json();
  list.innerHTML = "";

  todos.forEach((t) => {
    const li = document.createElement("li");
    li.setAttribute("data-testid", `todo-${t.id}`);
    li.innerHTML = `
      <span data-testid="title">${t.title}</span>
      <input data-testid="toggle" type="checkbox" ${t.completed ? "checked" : ""} />
      <button data-testid="delete">Delete</button>
    `;

    li.querySelector('[data-testid="toggle"]').addEventListener("change", async (e) => {
      await api(`/api/todos/${t.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: e.target.checked }),
      });
      load();
    });

    li.querySelector('[data-testid="delete"]').addEventListener("click", async () => {
      await api(`/api/todos/${t.id}`, { method: "DELETE" });
      load();
    });

    list.appendChild(li);
  });

  status.textContent = `Loaded ${todos.length} todos`;
}

addBtn.addEventListener("click", async () => {
  const title = newTodo.value.trim();
  if (!title) return;

  await api("/api/todos", { method: "POST", body: JSON.stringify({ title }) });
  newTodo.value = "";
  load();
});

load();
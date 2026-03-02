import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { TodosPage } from "./pages/todos.page";

const resetToken = process.env.ADMIN_RESET_TOKEN || "reset-token";

test.beforeEach(async ({ request }) => {
  const res = await request.post("/api/admin/reset", {
    headers: { "x-reset-token": resetToken },
  });
  expect(res.ok()).toBeTruthy();
});

test("login and view seeded todos", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login("sdet@example.com", "password123");

  await expect(page).toHaveURL(/todos\.html/);
  const todos = new TodosPage(page);
  await todos.assertLoaded();
  await expect(todos.list).toContainText("Buy milk");
  await expect(todos.list).toContainText("Write tests");
});

test("add a todo", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login("sdet@example.com", "password123");

  const todos = new TodosPage(page);
  await todos.addTodo("Ship CI signals");
});

test("login fails with wrong password", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login("sdet@example.com", "wrong");
  await login.assertLoginFailed();
});
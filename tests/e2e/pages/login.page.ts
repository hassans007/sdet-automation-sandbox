import { Page, expect } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  email = this.page.getByTestId("email");
  password = this.page.getByTestId("password");
  loginBtn = this.page.getByTestId("login-btn");
  error = this.page.getByTestId("error");

  async goto() {
    await this.page.goto("/");
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async assertLoginFailed() {
    await expect(this.error).toHaveText("Login failed");
  }
}
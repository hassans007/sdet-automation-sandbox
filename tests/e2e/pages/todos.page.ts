import { Page, expect } from "@playwright/test";

export class TodosPage {
  constructor(private page: Page) {}

  newTodo = this.page.getByTestId("new-todo");
  addBtn = this.page.getByTestId("add-btn");
  list = this.page.getByTestId("todo-list");
  status = this.page.getByTestId("status");

  todoItem(id: number) {
    return this.page.getByTestId(`todo-${id}`);
  }

  async assertLoaded() {
    await expect(this.status).toContainText("Loaded");
  }

  async addTodo(title: string) {
    await this.newTodo.fill(title);
    await this.addBtn.click();
    await expect(this.list).toContainText(title);
  }
}
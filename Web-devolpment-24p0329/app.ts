// app.ts - UI layer
import { PersistentTodoStore, Todo, Filter } from "./todo.js";

const store = new PersistentTodoStore();
let currentFilter: Filter = "all";

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

const form = byId<HTMLFormElement>("todo-form");
const input = byId<HTMLInputElement>("todo-input");
const list = byId<HTMLUListElement>("todo-list");
const counter = byId<HTMLSpanElement>("counter");
const clearCompletedBtn = byId<HTMLButtonElement>("clear-completed");
const clearAllBtn = byId<HTMLButtonElement>("clear-all");
const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter");

function createItem(todo: Todo): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "todo" + (todo.completed ? " completed" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => store.toggle(todo.id));

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = todo.text;
  label.addEventListener("dblclick", () => startEditing(li, label, todo));

  const del = document.createElement("button");
  del.className = "delete";
  del.title = "Delete";
  del.textContent = "🗑";
  del.addEventListener("click", () => store.remove(todo.id));

  li.append(checkbox, label, del);
  return li;
}

function startEditing(li: HTMLLIElement, label: HTMLSpanElement, todo: Todo): void {
  const editor = document.createElement("input");
  editor.type = "text";
  editor.className = "editor";
  editor.value = todo.text;
  li.replaceChild(editor, label);
  editor.focus();
  editor.select();

  let finished = false;
  const finish = (save: boolean): void => {
    if (finished) return;
    finished = true;
    if (save) store.edit(todo.id, editor.value);
    else render(store.all);
  };

  editor.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });
  editor.addEventListener("blur", () => finish(true));
}

function render(_todos: Todo[]): void {
  const visible = store.getFiltered(currentFilter);
  list.replaceChildren(...visible.map(createItem));

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Nothing here yet.";
    list.append(empty);
  }

  const n = store.itemsLeft;
  counter.textContent = `${n} ${n === 1 ? "item" : "items"} left`;
  clearCompletedBtn.disabled = !store.hasCompleted;
  clearAllBtn.disabled = store.all.length === 0;

  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  store.add(input.value);
  input.value = "";
  input.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter as Filter;
    render(store.all);
  });
});

clearCompletedBtn.addEventListener("click", () => store.clearCompleted());
clearAllBtn.addEventListener("click", () => store.clearAll());

store.subscribe(render); // callback: re-render whenever the store changes
render(store.all);

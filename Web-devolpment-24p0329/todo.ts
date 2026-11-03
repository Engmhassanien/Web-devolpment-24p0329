// todo.ts - data layer (classes, inheritance, getters, callbacks, spread, destructuring)

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export type Filter = "all" | "active" | "completed";
export type Listener = (todos: Todo[]) => void;

export class TodoStore {
  protected todos: Todo[];
  private nextId: number;
  private listeners: Listener[] = [];

  constructor(initial: Todo[] = []) {
    this.todos = [...initial]; // spread: copy so we never mutate the caller's array
    this.nextId = initial.reduce((max, { id }) => Math.max(max, id), 0) + 1; // destructuring
  }

  // Callback registration: the UI passes a function that runs whenever data changes
  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  protected notify(): void {
    this.listeners.forEach((listener) => listener([...this.todos]));
  }

  // Getter: computed property, no parentheses when used
  get itemsLeft(): number {
    return this.todos.filter((t) => !t.completed).length;
  }

  get hasCompleted(): boolean {
    return this.todos.some((t) => t.completed);
  }

  get all(): Todo[] {
    return [...this.todos];
  }

  getFiltered(filter: Filter): Todo[] {
    switch (filter) {
      case "active":
        return this.todos.filter((t) => !t.completed);
      case "completed":
        return this.todos.filter((t) => t.completed);
      default:
        return [...this.todos];
    }
  }

  add(text: string): void {
    const clean = text.trim();
    if (!clean) return;
    this.todos = [...this.todos, { id: this.nextId++, text: clean, completed: false }];
    this.notify();
  }

  toggle(id: number): void {
    this.todos = this.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    this.notify();
  }

  edit(id: number, text: string): void {
    const clean = text.trim();
    if (!clean) {
      this.remove(id); // saving an empty todo deletes it
      return;
    }
    this.todos = this.todos.map((t) => (t.id === id ? { ...t, text: clean } : t));
    this.notify();
  }

  remove(id: number): void {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.notify();
  }

  clearCompleted(): void {
    this.todos = this.todos.filter((t) => !t.completed);
    this.notify();
  }

  clearAll(): void {
    this.todos = [];
    this.notify();
  }
}

// Inheritance: same behaviour as TodoStore, plus saving to localStorage
export class PersistentTodoStore extends TodoStore {
  private key: string;

  constructor(key = "todos-24p0329") {
    super(PersistentTodoStore.load(key));
    this.key = key;
  }

  private static load(key: string): Todo[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  }

  protected override notify(): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.todos));
    } catch {
      /* storage unavailable - ignore */
    }
    super.notify();
  }
}

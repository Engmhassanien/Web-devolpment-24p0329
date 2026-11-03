// todo.ts - data layer (classes, inheritance, getters, callbacks, spread, destructuring)
export class TodoStore {
    constructor(initial = []) {
        this.listeners = [];
        this.todos = [...initial]; // spread: copy so we never mutate the caller's array
        this.nextId = initial.reduce((max, { id }) => Math.max(max, id), 0) + 1; // destructuring
    }
    // Callback registration: the UI passes a function that runs whenever data changes
    subscribe(listener) {
        this.listeners.push(listener);
    }
    notify() {
        this.listeners.forEach((listener) => listener([...this.todos]));
    }
    // Getter: computed property, no parentheses when used
    get itemsLeft() {
        return this.todos.filter((t) => !t.completed).length;
    }
    get hasCompleted() {
        return this.todos.some((t) => t.completed);
    }
    get all() {
        return [...this.todos];
    }
    getFiltered(filter) {
        switch (filter) {
            case "active":
                return this.todos.filter((t) => !t.completed);
            case "completed":
                return this.todos.filter((t) => t.completed);
            default:
                return [...this.todos];
        }
    }
    add(text) {
        const clean = text.trim();
        if (!clean)
            return;
        this.todos = [...this.todos, { id: this.nextId++, text: clean, completed: false }];
        this.notify();
    }
    toggle(id) {
        this.todos = this.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
        this.notify();
    }
    edit(id, text) {
        const clean = text.trim();
        if (!clean) {
            this.remove(id); // saving an empty todo deletes it
            return;
        }
        this.todos = this.todos.map((t) => (t.id === id ? { ...t, text: clean } : t));
        this.notify();
    }
    remove(id) {
        this.todos = this.todos.filter((t) => t.id !== id);
        this.notify();
    }
    clearCompleted() {
        this.todos = this.todos.filter((t) => !t.completed);
        this.notify();
    }
    clearAll() {
        this.todos = [];
        this.notify();
    }
}
// Inheritance: same behaviour as TodoStore, plus saving to localStorage
export class PersistentTodoStore extends TodoStore {
    constructor(key = "todos-24p0329") {
        super(PersistentTodoStore.load(key));
        this.key = key;
    }
    static load(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        }
        catch {
            return [];
        }
    }
    notify() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.todos));
        }
        catch {
            /* storage unavailable - ignore */
        }
        super.notify();
    }
}

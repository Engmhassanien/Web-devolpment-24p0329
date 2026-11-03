# CSE343 Web Development – Lab 4: Todo App

Author: Mahmoud Mohamed Hassanien (24p0329)

A Todo app written in **TypeScript**, transpiled to JavaScript with `tsc`, and served with **Node.js**.

## Features
- Add, delete, and complete todos
- Double-click a todo to edit, Enter to save, Esc to cancel
- Filters: All / Active / Completed
- "N items left" counter, Clear completed, Clear all
- Todos persist in `localStorage`

## Run
```bash
npm install
npm run build   # tsc -> generates app.js and todo.js
npm start       # http://localhost:3000
```

## Lab concepts used
ES6 classes, `extends`/`super`, getters, arrow functions, template literals, destructuring, spread/rest,
`map`/`filter`, callbacks (`subscribe`), ES modules (`import`/`export`), TypeScript types/interfaces, `tsconfig.json`.

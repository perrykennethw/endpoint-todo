# Vue 3 + TypeScript + Vite Todo App

This project is a Todo application built with Vue 3, TypeScript, and Vite. It features task management with due dates, task completion status, and automatic sorting of tasks based on their status and due dates.

## Features

- read, update tasks
- Mark tasks as complete or incomplete
- Automatic sorting of tasks (overdue, incomplete, complete)
- Responsive design with Tailwind CSS

## Bonus Features

- Set and update due dates for tasks
- Rate limiting for API requests
- Error handling with modal displays

## Getting Started

To get started with this project:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory and add your API key:
   ```
   VITE_API_KEY=your_api_key_here
   VITE_API_BASE_URL=your_api_base_url_here
   ```
4. Run `npm run dev` to start the development server
5. Open your browser and navigate to `http://localhost:5173`
6. If you would like to test this on your mobile device and your phone is on the same network, you can run `npm run dev:mobile` to receive a link to access it on your phone as well.

For production build, run `npm run build`.

## Packages Used

This project uses the following packages:

- [Vue 3](https://v3.vuejs.org/): Progressive JavaScript framework for building user interfaces.
- [Vite](https://vitejs.dev/): Next generation frontend tooling.
- [TypeScript](https://www.typescriptlang.org/): Typed superset of JavaScript.
- [Axios](https://axios-http.com/): Promise-based HTTP client for the browser and Node.js.
- [@vuepic/vue-datepicker](https://vue3datepicker.com/): Datepicker component for Vue 3.
- [@formkit/auto-animate](https://auto-animate.formkit.com/): Add motion to your apps with a single line of code.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework.
- [DaisyUI](https://daisyui.com/): Tailwind CSS component library.
- [PostCSS](https://postcss.org/): A tool for transforming CSS with JavaScript.
- [Autoprefixer](https://github.com/postcss/autoprefixer): PostCSS plugin to parse CSS and add vendor prefixes.
- [ESLint](https://eslint.org/): Pluggable JavaScript linter.
- [Prettier](https://prettier.io/): Opinionated code formatter.

## Development Dependencies

- [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue): Vite plugin for Vue 3 support.
- [typescript](https://www.typescriptlang.org/): TypeScript language.
- [vite](https://vitejs.dev/): Build tool and development server.
- [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc): TypeScript compiler for Vue 3.
- [sass](https://sass-lang.com/): CSS extension language.
- [vite-plugin-vue-devtools](https://github.com/webfansplz/vite-plugin-vue-devtools): A Vite plugin for Vue DevTools.

## Project Structure

- `src/`: Source files
  - `components/`: Vue components
    - `tasks/`: Task-related components
    - `modals/`: Modal components
  - `types/`: TypeScript type definitions
  - `App.vue`: Main application component
  - `main.ts`: Application entry point
- `public/`: Public assets
- `index.html`: HTML entry point

## API Integration

This project integrates with a backend API for task management. The API base URL and key are configured through environment variables.

## Styling

The project uses Tailwind CSS for styling, with additional custom styles in component files. DaisyUI is used for pre-built Tailwind components.

## License

This project is open source and available under the [MIT License](LICENSE).

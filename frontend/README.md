## **Table of Contents**

1. [Frontend](#frontend)  
   1.1. [File Structure of Frontend](#file-structure-of-frontend)  
   1.2. [Folder and File Explanations](#folder-and-file-explanations)  
   1.3. [Frontend `package.json`](#frontend-packagejson)  
   1.4. [Frontend Dependencies](#frontend-dependencies)

2. [Backend](#backend)  

---

## **Frontend**

The frontend serves as the user interface layer of the application, interacting with the backend via API calls to provide a seamless experience for users.

### **File Structure of Frontend**

```bash
├── frontend 
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── index.html
│   ├── package-lock.json
│   ├── package.json
└── README.md
```

### **Folder and File Explanations**

- **public/**  
  Contains static files like `_redirects`, `robots.txt`, `sitemap.xml` for [SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) optimization.

- **src/**  
  The source code directory that houses the core functionality of the frontend application.

  - **assets/**  
    Stores static assets like images and other resources used throughout the app. Additionally, this folder contains:
    - **CustomComponents.jsx**: Contains reusable components that can be utilized across various parts of the frontend.
    - **dashboardPages.js**: Contains components or pages specifically for the dashboard view.
    - **imports.js**: Includes modules or files that are imported and shared across multiple components or views.
    - **sx.js**: Exports **sx** (style) classes for styling components, typically using the `sx` prop from the [MUI](https://mui.com/system/the-sx-prop/) library for consistent styling.

  - **components/**  
    Contains reusable React components. These components are the building blocks of the application, such as product cards, dashboard action modals, navbar components, etc.

  - **pages/**  
    Contains React components representing the main views or pages of the app, such as Home, Product Details, Orders, etc.

  - **services/**  
    Contains helper functions for interacting with the backend API.

  - **store/**  
    This folder contains the Redux-related files for managing the global application state. It ensures consistent and predictable state management across the app. Key components include:
    - **actions/**: Contains action creators that define the actions dispatched to the Redux store, modifying the state.
    - **reducers/**: Houses reducers that define how the state should change in response to dispatched actions. Each reducer manages a slice of the overall state.
    - **rootReducer.js**: Combines all individual reducers into a single root reducer, providing a unified state structure for the app.
    - **store.js**: Central configuration for the Redux store, integrating the root reducer, middleware, and other Redux settings to manage the app’s state.
    - **types.js**: Defines constants for action types to ensure consistency and prevent typo-related bugs in action names and reducers.

  - **utils/**  
    Contains utility functions and helper methods used throughout the application. Key files include:
    - **axiosInstance.js**: Configures and exports an Axios instance for making API requests, with cookie-based authentication.
    - **checkEnv.js**: Verifies that all required environment variables are set, ensuring the app runs with the correct configuration.
    - **config.js**: Centralized configuration file for setting base URLs and other global settings across the app.
    - **theme.js**: Defines and exports the app’s theme settings, such as colors and typography, to maintain a consistent design.

- **App.jsx**  
  The root React component that defines the overall structure and routes of the application.

- **index.css**  
  Global CSS file that defines general styles, often including resets or utility classes.

- **main.jsx**  
  The entry point for the React app, responsible for rendering the root component (`App.jsx`) into the DOM.

- **index.html**  
  The HTML template served when the application is loaded in the browser.

---

### **Frontend `package.json`**

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "check-env": "node ./src/utils/checkEnv.js",
    "dev": "npm run check-env && vite --port 3000 --open",
    "build": "npm run check-env && vite build && cp public/_redirects dist/",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mui/icons-material": "^5.16.1",
    "@mui/material": "^5.16.1",
    "@mui/x-data-grid": "^7.14.0",
    "@reduxjs/toolkit": "^2.3.0",
    "@splidejs/react-splide": "^0.7.12",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "axios": "^1.7.2",
    "dotenv": "^16.4.7",
    "framer-motion": "^11.3.12",
    "jspdf": "^2.5.2",
    "jspdf-autotable": "^3.8.4",
    "npm": "^11.0.0",
    "postcss": "^8.4.39",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-intersection-observer": "^9.13.1",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.24.1",
    "react-swipeable": "^7.0.1",
    "react-toastify": "^10.0.5",
    "redux": "^5.0.1",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7"
  }
}
```

---

### **Frontend Dependencies**

- **[Material UI](https://mui.com):** Prebuilt React components such as buttons, icons, and grids.
- **[Axios](https://www.npmjs.com/package/axios):** Simplifies making HTTP requests to the backend API.
- **[React Router DOM](https://www.npmjs.com/package/react-router-dom):** Used for routing between different pages of the app.
- **[React Redux](https://www.npmjs.com/package/react-redux):** Provides bindings to manage state with Redux in React apps.
- **[React Intersection Observer](https://www.npmjs.com/package/react-intersection-observer):** Detects when elements (like products) are visible in the viewport, useful for infinite scroll.
- **[Tailwind CSS](https://tailwindcss.com):** A utility-first CSS framework for fast and responsive UI design.
- **[Framer Motion](https://www.npmjs.com/package/framer-motion):** For adding animations to the UI.
- **[Vite](https://vite.dev/guide/):** A fast build tool, used for frontend development and bundling.
- **[React Toastify](https://www.npmjs.com/package/react-toastify):** Provides notifications in the UI.

---

## **Backend**

This frontend communicates with a robust backend API, which is fully documented and accessible through Postman. For detailed information on the API endpoints, request/response formats, and usage examples, please refer to the official [API documentation](https://documenter.getpostman.com/view/31736145/2sA3kRL56j) for sheero.
For more information on the backend setup and usage, you can refer to the [README](backend/README.md) in the backend repository.
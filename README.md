# sheero

## Overview

This is a full-stack e-commerce platform built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The project provides a user-friendly interface for shopping, managing products, and interacting with the platform efficiently.

You can check out the live demo of sheero [here](https://sheero.onrender.com).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Stripe Payment Testing](#stripe-payment-testing)
- [API Documentation](#api-documentation)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone repository_url
   cd project_directory
   ```

2. Install the backend dependencies:
   ```bash
   cd server
   npm i
   ```

3. Install the frontend dependencies:
   ```bash
   cd frontend
   npm i
   ```

4. Create a `.env` file in both the `server` and `frontend` directories to store environment variables:

   **Backend (`backend/.env`)**
   ```bash
   BACKEND_PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXX
   NODE_ENV=development
   SEED_DB=true
   ADMIN_FIRST_NAME=Admin
   ADMIN_LAST_NAME=User
   ADMIN_EMAIL=admin@gmail.com
   ADMIN_PASSWORD=WqFpq%!QLsQt4
   ```

   **Frontend (`frontend/.env`)**
   ```bash
   NODE_ENV=development
   ```

   ### ``.env`` explanations
  - **BACKEND_PORT**: The port on which the backend server will run (e.g., 5000).
  - **MONGODB_URI**: The connection string for your MongoDB database.
  - **JWT_SECRET**: A secret key used for signing JSON Web Tokens.
  - **STRIPE_SECRET_KEY**: Your Stripe API secret key for payment processing.
  - **NODE_ENV**: The environment in which the app is running (`development` or `production`).
  - **SEED_DB**: Set to `true` to enable initial database seeding (e.g., creating the default roles and the admin user). Useful for the first-time setup or resetting the database. Leave it empty or set to `false` to skip seeding.
  - **ADMIN_FIRST_NAME**, **ADMIN_LAST_NAME**, **ADMIN_EMAIL**, **ADMIN_PASSWORD**: Credentials for the default admin user to be created during database seeding.

5. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

6. Start the frontend application:
   ```bash
   cd frontend
   npm run dev
   ```

7. To run both frontend and backend simultaneously, navigate to the root project directory `sheero/` and run:
   ```bash
   npm i
   npm start
   ```

The root `package.json` should look like this:

```json
{
  "name": "sheero",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "concurrently --kill-others \"npm run start-frontend\" \"npm run start-backend\"",
    "start-frontend": "cd frontend && npm run dev",
    "start-backend": "cd backend && npm run dev"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "concurrently": "^9.1.0"
  }
}
``` 

After running ``npm start`` in the backend directory, the application will automatically seed the database with default roles and an admin user (using the credentials from the ``.env`` file) based on the SEED_DB environment variable, ensuring a quick and easy setup for initial use.

## Usage

Once the application is running, you can access it in your web browser at `http://localhost:3000`. You can register a new account, browse products, add an address, add items to your cart, and make purchases.

## Features

- User authentication and authorization with accessToken through cookies
- State management with Redux for handling application state
- Address management for shipping
- Product management with categories
- Wishlist for saving your favorite products
- Shopping cart functionality
- Simple payment options with Stripe or cash
- Real-time order tracking for updates on your purchases
- Users can submit reviews and request returns for products in orders with the status marked as ``Delivered``

### Technologies Used

#### Frontend
The frontend is built with modern web technologies that focus on UI/UX, routing, and handling API requests efficiently.

## `package.json` in Frontend

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3000 --open",
    "build": "vite build && cp public/_redirects dist/",
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
    "axios": "^1.7.2",
    "framer-motion": "^11.3.12",
    "jspdf": "^2.5.2",
    "jspdf-autotable": "^3.8.4",
    "npm": "^11.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-intersection-observer": "^9.13.1",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.24.1",
    "react-swipeable": "^7.0.1",
    "react-toastify": "^10.0.5",
    "redux": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  }
}
```
- [**Material UI**](https://mui.com): Provides prebuilt components for React, including icons, buttons, and grids.
- [**Axios**](https://www.npmjs.com/package/axios): Simplifies HTTP requests, making it easier to fetch data from the backend.
- [**React Router DOM**](https://www.npmjs.com/package/react-router-dom): Enables routing between different pages in the app.
- [**React Redux**](https://www.npmjs.com/package/react-redux): A library that provides bindings for Redux, allowing you to manage application state and pass it to React components efficiently using hooks like `useDispatch` and `useSelector`.  
- [**React Intersection Observer**](https://www.npmjs.com/package/react-intersection-observer): A React wrapper used to detect when products in home page are visible in the viewport, enabling the load more feature functionality.
- [**Tailwind CSS**](https://tailwindcss.com): Utility-first CSS framework for rapid UI development.
- [**Framer Motion**](https://www.npmjs.com/package/framer-motion): Provides animation capabilities for enhanced user experience.
- [**Vite**](https://vite.dev/guide/): A fast frontend build tool, replacing Webpack for development and build processes.
- [**React Toastify**](https://www.npmjs.com/package/react-toastify): A package for showing customizable notifications in the app.

#### Backend
The backend is a Node.js API server designed to handle requests, manage authentication, and interact with the MongoDB database. It uses JWT tokens for secure access and authorization, along with Stripe for payment integration.

## `package.json` in Backend

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Node.js backend for role-based JWT authentication for an e-commerce website with access tokens",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "stripe": "^16.12.0",
    "yup": "^1.4.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
- [**Bcrypt.js**](https://www.npmjs.com/package/bcryptjs): A hashing library for securely storing and comparing user passwords.
- [**Cookie Parser**](https://www.npmjs.com/package/cookie-parser): Middleware for parsing cookies in HTTP requests, making it easier to work with cookies in a Node.js application, especially for handling session data or authentication tokens
- [**CORS**](https://www.npmjs.com/package/cors): Middleware for enabling Cross-Origin Resource Sharing, allowing frontend access from different domains.
- [**Express.js**](https://www.npmjs.com/package/express): A minimalist web framework for Node.js, making it easy to set up routes and middleware.
- [**JWT (jsonwebtoken)**](https://jwt.io/introduction): Used for secure authentication and authorization via tokens.
- [**Mongoose**](https://www.npmjs.com/package/mongoose): A library for interacting with MongoDB, providing an object data modeling (ODM) solution.
- [**Multer**](https://www.npmjs.com/package/multer): A middleware for handling multipart form data, in this case used for uploading images. 
- [**Nodemon**](https://www.npmjs.com/package/nodemon): Automatically restarts the server on file changes, speeding up development.
- [**Stripe**](https://www.npmjs.com/package/stripe): For securely processing payments online with ease, with out-of-the-box integration.
- [**Yup**](https://www.npmjs.com/package/yup): A JavaScript schema builder for value parsing and validation, in this case used for data validation.

## Stripe Payment Testing

You can use the following test card details to simulate payments in Stripe. If any problem occurs, refer to the [official Stripe documentation](https://docs.stripe.com/testing?testing-method=card-numbers).

| Brand                | Number              | CVC           | Expiry Date   |
|----------------------|---------------------|---------------|---------------|
| **Visa**             | 4242424242424242     | Any 3 digits  | Any future date |
| **Visa (debit)**     | 4000056655665556     | Any 3 digits  | Any future date |
| **Mastercard**        | 5555555555554444     | Any 3 digits  | Any future date |
| **Mastercard (2-series)** | 2223003122003222 | Any 3 digits  | Any future date |
| **Mastercard (debit)** | 5200828282828210    | Any 3 digits  | Any future date |
| **Mastercard (prepaid)** | 5105105105105100 | Any 3 digits  | Any future date |
| **American Express**  | 378282246310005      | Any 4 digits  | Any future date |
| **American Express**  | 371449635398431      | Any 4 digits  | Any future date |
| **Discover**          | 6011111111111117     | Any 3 digits  | Any future date |
| **Discover**          | 6011000990139424     | Any 3 digits  | Any future date |
| **Discover (debit)**  | 6011981111111113     | Any 3 digits  | Any future date |
| **Diners Club**       | 3056930009020004     | Any 3 digits  | Any future date |
| **Diners Club (14-digit card)** | 36227206271667 | Any 3 digits | Any future date |
| **BCcard and DinaCard** | 6555900000604105   | Any 3 digits  | Any future date |
| **JCB**              | 3566002020360505     | Any 3 digits  | Any future date |
| **UnionPay**         | 6200000000000005     | Any 3 digits  | Any future date |
| **UnionPay (debit)** | 6200000000000047     | Any 3 digits  | Any future date |
| **UnionPay (19-digit card)** | 6205500000000000004 | Any 3 digits | Any future date |

---
## API Documentation

The frontend communicates with a robust backend API, which is fully documented and accessible through Postman. For detailed information on the API endpoints, request/response formats, and usage examples, refer to the official [API documentation](https://documenter.getpostman.com/view/31736145/2sA3kRL56j) for sheero.
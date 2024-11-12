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
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install the backend dependencies:
   ```bash
   cd server
   npm i
   ```

3. Install the frontend dependencies:
   ```bash
   cd client
   npm i
   ```

4. Create a `.env` file in both the `server` and `client` directories to store environment variables:

   **Backend (`backend/.env`)**
   ```bash
   BACKEND_PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   NODE_ENV=development
   ```

   **Frontend (`client/.env`)**
   ```bash
   VITE_CRYPTOJS_SECRET_KEY=<your-cryptojs-secret-key>
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

6. Start the frontend application:
   ```bash
   cd client
   npm run dev
   ```

7. To run both frontend and backend simultaneously, navigate to the root project directory `sheero/` and run:
   ```bash
   npm i
   npm start
   ```

## Usage

Once the application is running, you can access it in your web browser at `http://localhost:3000`. You can register a new account, browse products, add items to your cart, and make purchases.

## Features

- User authentication and authorization
- Address management for shipping
- Product management with categories
- Wishlist for saving favorite products
- Shopping cart functionality
- Simple payment options with Stripe or cash
- Real-time order tracking for updates on your purchases
- Users can make a return request for specific product(s) from an order if the status is marked as `Delivered`
- Reviews and ratings for products

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
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mui/icons-material": "^5.16.1",
    "@mui/material": "^5.16.1",
    "@mui/x-data-grid": "^7.14.0",
    "@splidejs/react-splide": "^0.7.12",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "axios": "^1.7.2",
    "crypto-js": "^4.2.0",
    "framer-motion": "^11.3.12",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.24.1",
    "react-toastify": "^10.0.5"
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
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "shortid": "^2.2.16",
    "stripe": "^16.12.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
- [**Express.js**](https://www.npmjs.com/package/express): A minimalist web framework for Node.js, making it easy to set up routes and middleware.
- [**Mongoose**](https://www.npmjs.com/package/mongoose): A library for interacting with MongoDB, providing an object data modeling (ODM) solution.- 
- [**Nodemon**](https://www.npmjs.com/package/nodemon): Automatically restarts the server on file changes, speeding up development.
- [**JWT (jsonwebtoken)**](https://jwt.io/introduction): Used for secure authentication and authorization via tokens.
- [**Bcrypt.js**](https://www.npmjs.com/package/bcryptjs): A hashing library for securely storing and comparing user passwords.
- [**Stripe**](https://stripe.com): For processing payments securely with easy integration.
- [**Multer**](https://www.npmjs.com/package/multer): A middleware for handling multipart form data, in this case mainly used for uploading images.
- [**ShortID**](https://www.npmjs.com/package/shortid): Generates unique, non-sequential IDs for orders.
- [**CORS**](https://www.npmjs.com/package/cors): Middleware for enabling Cross-Origin Resource Sharing, allowing frontend access from different domains.

## Stripe Payment Testing

You can use the following test card details to simulate payments in Stripe ([Official Stripe documentation website](https://docs.stripe.com/testing?testing-method=card-numbers) in case of any changes):

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
# sheero

## Overview

This is a full-stack e-commerce platform built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The project aims to provide a user-friendly interface for shopping, managing products, and interacting with the platform efficiently.

You can check out the live demo of sheero [here](https://sheero.onrender.com).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
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
   npm install
   ```

3. Set up the frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the server directory to store environment variables, and add the following:
   ```
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

5. Start the backend server:
   ```bash
   cd server
   npm start
   ```

6. Start the frontend application:
   ```bash
   cd client
   npm start
   ```

## Usage

Once the application is running, you can access it in your web browser at `http://localhost:3000`. You can register a new account, browse products, add items to your cart, and make purchases. 

After the installation steps are done, you can go to the root project ``sheero/`` and run
```bash
npm i
```

to install the dependencies needed to run the frontend and backend at the same time; after the installation is done, run
```bash
npm start
```
in the root directory to start frontend and backend simultaneously.

## Features

- User authentication and authorization
- Address management for shipping
- Product management with categories
- Wishlist for saving favorite products
- Shopping cart functionality
- Simple payment options with Stripe or cash
- Real-time order tracking for updates on your purchases
- Reviews and ratings for products

## Technologies Used

- **Frontend**: React.js, Axios, React Router, Material-UI
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Other**: JSON Web Token (JWT) for authentication, bcrypt for password hashing

## API Documentation
The frontend of this project communicates with a robust backend API, which is fully documented and accessible through Postman. For detailed information on the API endpoints, request/response formats, and usage examples, please refer to the official [API documentation](https://documenter.getpostman.com/view/31736145/2sA3kRL56j) for sheero.
## **Table of Contents**

1. [Backend](#backend)  
   1.1. [File Structure of Backend](#file-structure-of-backend)  
   1.2. [Folder Content](#folder-content)  
   1.3. [Backend `package.json`](#backend-packagejson)  
   1.4. [Backend Dependencies](#backend-dependencies)  

---

## **Backend**

The backend provides APIs that are documented and accessible through Postman. You can refer to the official [API documentation](https://documenter.getpostman.com/view/31736145/2sA3kRL56j) for detailed information on endpoints, request/response formats, and usage examples for **sheero**.

### **File Structure of Backend**

```bash
├── backend 
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── validations
│   ├── package-lock.json
│   ├── package.json
│   └── index.js
└── README.md
```

### **Folder Content**

#### `config/`
- **checkEnv.js**: Ensures that required environment variables are defined. If any are missing, it throws an error with a clear message.
- **cookie.js**: Configures cookie settings for JWT token management, ensuring that authentication tokens are securely handled.
- **cors.js**: Sets up Cross-Origin Resource Sharing (CORS) settings, allowing or restricting access to the backend from specific domains.
- **db.js**: Establishes a connection to the MongoDB database, enabling the backend to read and write data to the database.
- **dotenv.js**: Loads environment variables from a `.env` file. This is essential for securely storing sensitive configuration values (like database credentials, API keys, and secrets). It uses the `dotenv` package to load variables, and if any are missing or undefined, it will throw an error.
- **emailService.js**: Sends emails for different purposes using the configured SMTP settings defined in `mailer.js`.
- **mailer.js**: Configures a Gmail SMTP transporter for sending emails using the `nodemailer` library.
- **passport.js**: Configures strategies for user authentication via third-party services like Google and Facebook using Passport.js.
- **server.js**: Initializes and starts the server, setting up necessary configurations and listening for incoming API requests.

#### `controllers/`
- Contains the controller functions that define the core logic for each API endpoint. Each controller corresponds to an endpoint defined in the `routes/` folder.

#### `middleware/`
- Contains middleware functions that process requests before they reach the controller. Examples include authentication checks, file uploads, and data validation.

#### `models/`
- Contains MongoDB schema definitions for various entities (like User, Product, etc.) used in the database. This provides a structure for how data is stored and queried.

#### `routes/`
- Defines the API routes (URLs) and associates them with corresponding controller functions. This folder also handles route-level middleware applications like authentication and validation.

#### `uploads/`
- A folder where uploaded images are stored.

#### `validations/`
- Contains validation schemas using the `yup` library to ensure that incoming request data (e.g., JSON payloads) matches expected formats, improving reliability and security.

---

### **Backend `package.json`**

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Node.js backend for role-based JWT authentication for an e-commerce website with access tokens",
  "main": "index.js",
  "scripts": {
    "check-env": "node ./config/checkEnv.js",
    "start": "npm run check-env && node index.js",
    "dev": "npm run check-env && nodemon index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-session": "^1.18.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.10.0",
    "passport": "^0.7.0",
    "passport-facebook": "^3.0.0",
    "passport-google-oauth20": "^2.0.0",
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

---

### **Backend Dependencies**

- **[Bcrypt.js](https://www.npmjs.com/package/bcryptjs)**: A library used for securely hashing passwords before storing them, ensuring they are never saved in plain text.
- **[Cookie Parser](https://www.npmjs.com/package/cookie-parser)**: Middleware that helps manage and parse cookies in HTTP requests. This is especially useful for handling authentication tokens in cookies.
- **[CORS](https://www.npmjs.com/package/cors)**: A middleware for handling Cross-Origin Resource Sharing, enabling or restricting API access based on the origin of the request.
- **[Express.js](https://www.npmjs.com/package/express)**: A flexible web framework for Node.js that simplifies the creation of RESTful APIs and routing.
- **[JWT (jsonwebtoken)](https://jwt.io/introduction)**: A package that provides methods for creating, signing, and verifying JSON Web Tokens, used to secure API endpoints.
- **[Mongoose](https://www.npmjs.com/package/mongoose)**: An Object Document Mapper (ODM) that simplifies interactions with MongoDB by providing schema-based models for documents.
- **[Multer](https://www.npmjs.com/package/multer)**: Middleware used for handling multipart form data, commonly used for handling file uploads (like images).
- **[Nodemailer](https://www.npmjs.com/package/nodemailer)**: A library for sending emails using a SMTP transport, allowing the backend to send verification emails and other notifications.
- **[Passport](https://www.npmjs.com/package/passport)**: A middleware for handling authentication strategies, including Facebook and Google OAuth.
- **[Passport-Facebook](https://www.npmjs.com/package/passport-facebook)**: A strategy for authenticating users using Facebook OAuth.
- **[Passport-Google-OAuth20](https://www.npmjs.com/package/passport-google-oauth20)**: A strategy for authenticating users using Google OAuth.
- **[Nodemon](https://www.npmjs.com/package/nodemon)**: A development utility that automatically restarts the server when changes are detected in the source code.
- **[Stripe](https://www.npmjs.com/package/stripe)**: A library for integrating with the Stripe payment system, allowing the backend to handle payments securely.
- **[Yup](https://www.npmjs.com/package/yup)**: A JavaScript schema validator used for validating and parsing data to ensure it conforms to expected structures.
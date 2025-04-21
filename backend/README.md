## **Table of Contents**

1. [Backend](#backend)  
   1.1. [File Structure of Backend](#file-structure-of-backend)  
   1.2. [Folder Content](#folder-content)  
   1.3. [Backend `package.json`](#backend-packagejson)  
   1.4. [Backend Dependencies](#backend-dependencies)

2. [Frontend](#frontend) 

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
- **`auth/`**
  - `cookie.js`: Configures cookie settings for JWT token management, ensuring secure handling of authentication tokens.
  - `passport.js`: Sets up authentication strategies for third-party services (Google, Facebook) using Passport.js.

- **`core/`**
  - `checkEnv.js`: Validates that all required environment variables are defined, throwing clear errors for missing values.
  - `cors.js`: Configures Cross-Origin Resource Sharing (CORS) settings to control API access from different domains.
  - `db.js`: Establishes and manages the MongoDB database connection.
  - `dotenv.js`: Loads and validates environment variables from the `.env` file for secure configuration.
  - `server.js`: Handles Express server initialization and startup.

- **`email/`**
  - `emailContent/`: Contains all HTML email templates and generators.
  - `emailService.js`: Main service for sending various types of emails.
  - `emailUtils.js`: Utility functions supporting email operations.
  - `mailer.js`: Configures the SMTP transporter (using nodemailer) for email delivery.

#### `controllers/`
- Contains the core business logic for each API endpoint, with each controller corresponding to specific route definitions.

#### `middleware/`
- Houses middleware functions that process requests before reaching controllers, including:
  - Authentication verification
  - File upload handling
  - Request data validation

#### `models/`
- Defines MongoDB schemas and models for all application entities (Users, Products, etc.), establishing the data structure and relationships.

#### `routes/`
- Maps API endpoints to their corresponding controller functions and applies route-specific middleware (authentication, validation).

#### `uploads/`
- Storage directory for all user-uploaded files and images.

#### `validations/`
- Contains Yup validation schemas that ensure incoming request data meets required formats and constraints improving reliability and security for API endpoints.

---

### **Backend `package.json`**

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Node.js backend for role-based JWT authentication for an e-commerce website with access tokens",
  "main": "index.js",
  "scripts": {
    "check-env": "node ./config/core/checkEnv.js",
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
    "qrcode": "^1.5.4",
    "slugify": "^1.6.6",
    "speakeasy": "^2.0.0",
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
- **[Qrcode](https://www.npmjs.com/package/qrcode)**: A library for generating QR codes, used for generating QR codes for 2FA user authentication.
- **[Speakeasy](https://www.npmjs.com/package/speakeasy)**: A library for generating and verifying one-time passwords (OTPs), used for 2FA in user authentication with authenticator applications.
- **[Nodemon](https://www.npmjs.com/package/nodemon)**: A development utility that automatically restarts the server when changes are detected in the source code.
- **[Stripe](https://www.npmjs.com/package/stripe)**: A library for integrating with the Stripe payment system, allowing the backend to handle payments securely.
- **[Yup](https://www.npmjs.com/package/yup)**: A JavaScript schema validator used for validating and parsing data to ensure it conforms to expected structures.
- **[Slugify](https://www.npmjs.com/package/slugify)**: A library for generating slugs (URL-friendly strings) from text, ensuring URLs are user-friendly and SEO-friendly.

## **Frontend**

The frontend is built using React and is hosted in [Render](https://sheero.onrender.com).
For more information on the frontend setup and usage, you can refer to the [README](frontend/README.md) in the frontend repository.
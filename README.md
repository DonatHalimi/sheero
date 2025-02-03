# sheero

## Table of Contents

- [Overview](#overview)  
- [Table of Contents](#table-of-contents)  
- [Installation](#installation)  
  - [.env explanations](#env-explanations)  
  - [Setting up Google and Facebook OAuth](#setting-up-google-and-facebook-oauth)  
    - [Google Client ID and Client Secret](#google-client-id-and-client-secret)  
    - [Facebook App ID and App Secret](#facebook-app-id-and-app-secret)  
  - [Setting Up SMTP with Gmail](#setting-up-smtp-with-gmail)
- [Usage](#usage)  
- [Features](#features)  
- [Technologies Used](#technologies-used)  
  - [Frontend](#frontend)  
  - [Backend](#backend)  
- [Stripe Payment Testing](#stripe-payment-testing)  
- [API Documentation](#api-documentation)  

## Overview

This is a full-stack e-commerce platform built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The project provides a user-friendly interface for shopping, managing products, and interacting with the platform efficiently.

You can check out the live demo of sheero [here](https://sheero.onrender.com).

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone repository_url
   cd project_directory
   ```

2. Install the backend dependencies:
   ```bash
   cd backend
   npm i
   ```

3. Install the frontend dependencies:
   ```bash
   cd frontend
   npm i
   ```

4. Create a `.env` file in both the `backend` and `frontend` directories to store environment variables:

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
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_CLIENT_ID=your_facebook_client_id
   FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_pass
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
  - **SESSION_SECRET**: A secret key used for signing session cookies.
  - **GOOGLE_CLIENT_ID**, **GOOGLE_CLIENT_SECRET**: Client IDs and secrets for Google OAuth integration.
  - **FACEBOOK_CLIENT_ID**, **FACEBOOK_CLIENT_SECRET**: Client IDs and secrets for Facebook OAuth integration.
  - **SMTP_USER**, **SMTP_PASS**: SMTP credentials for sending emails.

## Setting up Google and Facebook OAuth

### **Google Client ID and Client Secret Setup**

Google's OAuth credentials are required for integrating Google login into your application. Follow these steps:

1. **Go to Google Cloud Console:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/).

2. **Create a new project:**
   - Click the dropdown menu at the top, then select **New Project**.
   - Provide a name for the project and click **Create**.

3. **Set Up OAuth Consent Screen:**
   - Navigate to **API & Services** > **OAuth consent screen**.
   - Select **External** as the user type.
   - Provide the following details:
     - **App Name**: Your application's name.
     - **User Support Email**: Email to contact for support.
     - **App Logo**: Upload your app logo (optional but recommended).
     - **App Domains**: Add the domain where the frontend is hosted.
     - **Authorized Domains**: Add domains for both the frontend and backend (e.g., `frontend.example.com`, `api.example.com`).
     - **Developer Contact Info**: Provide one or more email addresses for developers.
   - Add the following **scopes**:
     - `https://www.googleapis.com/auth/userinfo.email` – See your primary Google Account email address.
     - `https://www.googleapis.com/auth/userinfo.profile` – See your personal info, including any publicly available info.
     - `openid` – Associate you with your personal info on Google.
   - Save and continue.
   - Add **Test Users** under the "Test Users" section (e.g., email addresses of those who will test the app during development).
   - Finish setting up the consent screen.

4. **Create OAuth Credentials:**
   - Go to **API & Services** > **Credentials**.
   - Click **Create Credentials** and select **OAuth 2.0 Client IDs**.
   - Choose **Web application** as the application type.
   - Add **Authorized Redirect URIs** (e.g., `http://localhost:5000/api/auth/google/callback`).
   - Click **Create** to generate your **Client ID** and **Client Secret** and save them in the backend `.env` file.

5. **Official Guide:** Refer to the [Google OAuth Setup Documentation](https://developers.google.com/identity/protocols/oauth2) for more details.

---

### **Facebook App ID and App Secret**

Facebook credentials are needed for enabling Facebook login in your app. Follow these steps.

1. **Go to Meta for Developers:**
   - Visit [Meta for Developers](https://developers.facebook.com/).

2. **Create a New App:**
   - Log in and click **Get Started**.
   - Go to the **My Apps** section and click **Create App**.
   - Choose **Consumer** as the app type and click **Next**.
   - Provide an **App Name**, **Contact Email**, and click **Create App**.

3. **Add Facebook Login to Your App:**
   - In the app dashboard, click **Add Product** in the left sidebar.
   - Select **Facebook Login** and choose **Web** as the platform.
   - Follow the setup instructions to configure Facebook Login for your app, including adding the domain where your frontend or backend is hosted.

4. **Configure Basic Settings:**
   - Go to **Settings** > **Basic**, and fill in the following:
     - **App Domains**: Add domains where the frontend and backend are hosted (e.g., `frontend.example.com`, `api.example.com`).
     - **Privacy Policy URL**: Provide a valid link to your app's privacy policy.
     - **Terms of Service URL**: Optionally add a terms of service URL.
     - **App Icon**: Add an icon for your app (optional but recommended).
     - **Category**: Select a relevant category for your app.
     - Save the changes and note down your **App ID** and **App Secret** in the backend `.env` file.

5. **Set Up OAuth and Redirect URIs:**
   - Under **Facebook Login Settings**:
     - Add your **Valid OAuth Redirect URI** (e.g., `http://localhost:5000/api/auth/facebook/callback`).

6. **Add Permissions and Scopes:**
   - Go to **Use Cases** > **Authenticate and Request Data from Users with Facebook Login**.
   - Under **Customize**, click **Permissions** and add the **email** permission. This is necessary to access the user's email address during authentication.

7. **Official Guide:** Refer to the [Facebook Login Setup Documentation](https://developers.facebook.com/docs/facebook-login) for further guidance.

---

## Setting Up SMTP with Gmail  

To configure Gmail SMTP for sending emails from your application, follow these steps:  

### **Generate SMTP Credentials for Gmail**  

#### **SMTP Username**  
Your SMTP username is your Gmail email address (e.g., `your_email@gmail.com`).  

#### **SMTP Password (Google App Password)**  
If two-factor authentication is enabled, you must generate an App Password instead of using your regular password in the `.env` file.  

1. **Access Google Security Settings**  
   - Navigate to [Google Account Security](https://myaccount.google.com/security).  

2. **Generate an App Password**  
   - In the search bar at the navigation bar, type **"App passwords"**.  
   - Sign in again if prompted.  
   - Under the **App name** field, enter a relevant name for your application (e.g., **"sheero"**).  
   - Click **Create**, then copy the generated 16-character password into the backend `.env` file.  

---

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
    "check-frontend-env": "node frontend/src/utils/checkEnv.js",
    "check-backend-env": "node backend/config/checkEnv.js",
    "start": "npm run check-frontend-env && npm run check-backend-env && concurrently --kill-others \"npm run start-frontend\" \"npm run start-backend\"",
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

Once the application is running, you can access it in your web browser at `http://localhost:3000`. You can register a new account, browse products, add an address, add items to your cart and make purchases.

## Features

- User [authentication](https://auth0.com/intro-to-iam/what-is-authentication) and [authorization](https://auth0.com/intro-to-iam/what-is-authorization) using [JSON Web Tokens](https://jwt.io/introduction) through [cookies](https://www.cloudflare.com/learning/privacy/what-are-cookies/)
- [Google](https://developers.google.com) and [Facebook](https://developers.facebook.com) login options for seamless authentication
- [OTP](https://en.wikipedia.org/wiki/One-time_password) account verification through email for enhanced security, via local SMTP configuration
- [Role-based access control](https://auth0.com/docs/manage-users/access-control/rbac) for different user roles
- [Redux state management](https://redux.js.org/introduction/getting-started) for handling application state
- Address management for shipping
- Product management with categories
- Wishlist for saving your favorite products
- Shopping cart functionality
- Simple payment options with [Stripe](https://stripe.com) or cash
- Real-time order tracking for updates on your purchases
- Users can submit reviews and request returns for products in orders with the status marked as ``Delivered``

### Technologies Used

#### Frontend
The frontend is built with modern web technologies that focus on UI/UX, routing, and handling API requests efficiently.  
Follow the instructions in the [frontend/README.md](frontend/README.md) file to learn more about the structure of the frontend directory and `package.json`.

#### Backend
The backend is a Node.js API server designed to handle requests, manage authentication, and interact with the MongoDB database. It uses JWT tokens for secure access and authorization, along with Stripe for payment integration.  
Follow the instructions in the [backend/README.md](backend/README.md) file to learn more about the structure of the backend directory and `package.json`.

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
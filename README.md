### EcomCraft
---
EcomCraft is a full-stack e-commerce boilerplate. Get a head start on your online shop with a reliable, dockerized foundation using React, Node.js, B2-Backblaze, and Firebase. Focus on design and features, not complex setup.

### Features
- **User Authentication**: Secure sign-in using Firebase custom tokens.
- **Product Catalog**: Display products fetched from a backend API.
- **Custom Order Submission**: A form for authenticated users to submit custom orders with file uploads.
- **Secure File Uploads**: Integration with Backblaze B2 cloud storage for file uploads.
- **Order Tracking**: A component to track the status of an order by ID.
- **Invoice Display**: A protected endpoint for authenticated users to view invoice details.
- **Dockerized Architecture**: A mulit-container setup with a React frontend, Node.js backend, and NGINX reverse proxy.

### Technology Stack
- **Frontend**: React, Axios, Firebase Client SDK
- **Backend**: Node.js, Express, Firebase Admin SDK, AWS SDK (for B2)
- **Database**: Google Firestore
- **Cloud Storage**: Backblaze B2 (S3-compatible)
- **Containerization**: Docker Compose
- **Reverse Proxy**: NGINX

### Prerequisites 
Before you begin, you need to have the following installed:

- Docker and Docker Compose
- Node.js and npm
- A Firebase Project with Firestore and Authentication enabled.
- A Backblaze B2 Bucket with S3-compatible API enabled

### Getting Started
Follow these steps to set up and run the application.
#### Step 1: Clone the Repository
Clone the `EcomCraft` repository to your local machine.
1. `git clone https://github.com/drd60199/EcomCraft.git`
2. `cd EcomCraft`
#### Step 2: Configure Environment Variables
Create `.env` files to store your project's credentials.
#### Root Directory `.env` (for the Backend)
Create a file named `.env` in the root of the project (the same directory as `docker-compose.yml`). This file contains the sensitive keys for your backend services.
```
# Backblaze B2 S3-Compatible API Credentials
B2_KEY_ID=YOUR_B2_KEY_ID
B2_APPLICATION_KEY=YOUR_B2_APPLICATION_KEY
B2_ENDPOINT=YOUR_B2_ENDPOINT
B2_BUCKET_NAME=YOUR_B2_BUCKET_NAME

# Firebase Admin SDK Service Account Key
# This should be the Base64-encoded JSON string of your service account key.
FIREBASE_SERVICE_ACCOUNT_KEY=YOUR_BASE64_ENCODED_JSON_STRING
```
#### Frontend Directory `.env` (for the Frontend)
Create another file named `.env` in the `frontend` directory. This file contains the public API keys for your frontend.
```
# Frontend Environment Variables

# Firebase Configuration
# These keys are required to initialize the Firebase SDK in your frontend.
REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTHDOMAIN=YOUR_FIREBASE_AUTHDOMAIN
REACT_APP_FIREBASE_PROJECTID=YOUR_FIREBASE_PROJECTID
REACT_APP_FIREBASE_STORAGEBUCKET=YOUR_FIREBASE_STORAGEBUCKET
REACT_APP_FIREBASE_MESSAGINGSENDERID=YOUR_FIREBASE_MESSAGINGSENDERID
REACT_APP_FIREBASE_APPID=YOUR_FIREBASE_APPID
REACT_APP_FIREBASE_MEASUREMENTID=YOUR_FIREBASE_MEASUREMENTID
```
**Important**: Both of these `.env` files are already included in their respective `.gitignore` files, so they will not be committed to Git.

#### Step 3: Run the Application
With your `.env` files configured, you can now build and run the application using Docker Compose.
``` bash
# Build the images and start the containers in detached mode
docker compose up --build -d
```
This application will be accessible at `http://localhost`.

### Project Structure
- `/frontend`: Contains the React application and its `Dockerfile`.
- `/backend`: Contains the Node.js/Express API and its `Dockerfile`.
- `/nginx`: Contains the NGINX configuration file (`nginx.conf`) for the reverse proxy.
- `docker-compose.yml`: The main file for orchestrating all the services.

### Contributing
EcomCraft is an open-source project, and contributions are welcome!

### License
This project is licensed under the MIT License.



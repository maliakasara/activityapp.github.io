# Activity Booking API

A RESTful API for managing activities and bookings with a modern dark-themed frontend.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory with the following variables:

```
PORT = 8000
MONGO_URI = <your-mongodb-connection-string>
JWT_SECRET = <your-jwt-secret>
```

### 4. Start the Server

```bash
npm start
```

## API Endpoints

### Authentication Endpoints

#### Register User

- **URL**: `http://localhost:8000/api/auth/register`
- **Method**: `POST`
- **Body Sample**:

```json
{
  "name": "XYZ",
  "email": "xyz@gmail.com",
  "phone": "1234567890",
  "password": "123456"
}
```

#### Login

- **URL**: `http://localhost:8000/api/auth/login`
- **Method**: `POST`
- **Body Sample**:

```json
{
  "email": "xyz@gmail.com",
  "password": "123456"
}
```

- **Response**: Returns JWT token for authentication

### Activity Endpoints

#### Get All Activities

- **URL**: `http://localhost:8000/api/activities`
- **Method**: `GET`

#### Add New Activity

- **URL**: `http://localhost:8000/api/activities`
- **Method**: `POST`
- **Body Sample**:

```json
{
  "title": "Champions League Final",
  "description": "Liverpool vs Real Madrid",
  "location": "Istanbul",
  "date": "2025-07-31",
  "time": "12.30"
}
```

### Protected Routes

The following endpoints require authentication. Include the JWT token in the request header:

#### Get User Bookings

- **URL**: `http://localhost:8000/api/bookings/my-bookings`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {token}`

#### Book an Activity

- **URL**: `http://localhost:8000/api/bookings/book`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {token}`
- **Body Sample**:

```json
{
  "activityId": "681e62f60c469b04b738512f"
}
```

## Frontend

A modern, responsive frontend is included in the `client/` directory. Features include:

- **Dark Theme**: Professional black theme with glass morphism effects
- **User Authentication**: Sign up, login, and logout functionality
- **Activity Management**: View and create activities
- **Booking System**: Book activities and view your bookings
- **Responsive Design**: Works perfectly on all devices

### Running the Frontend

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Open `index.html` in your browser or serve it using a local server:

   ```bash
   # Using Python 3
   python -m http.server 3000

   # Using Node.js (if you have http-server installed)
   npx http-server -p 3000
   ```

3. Access the application at `http://localhost:3000`

## Testing

Use the provided API endpoints to test the functionality. Make sure to save the token received after login to use with the protected routes.

### Testing Workflow

1. **Start the backend server** (from root directory):

   ```bash
   npm start
   ```

2. **Open the frontend** in your browser

3. **Register a new account** or login with existing credentials

4. **Create activities** and **book them** to test the full workflow

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are hashed using bcrypt
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Variables**: Sensitive data stored in environment variables

## Technologies Used

### Backend

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-validator** for input validation

### Frontend

- **HTML5** with **CSS3**
- **Vanilla JavaScript** (ES6+)
- **Font Awesome** icons
- **Inter** font family
- **Glass morphism** design effects

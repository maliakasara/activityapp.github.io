# Activity Booking App - Frontend

A simple and modern frontend for the Activity Booking App built with HTML, CSS, and JavaScript.

## Features

- **User Authentication**: Sign up and login functionality
- **Activity Management**: View all activities and create new ones
- **Booking System**: Book activities and view your bookings
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and intuitive user interface

## How to Run

1. **Start the Backend Server** (from the root directory):

   ```bash
   npm start
   ```

   This will start the server on `http://localhost:8000`

2. **Open the Frontend**:

   - Navigate to the `client` folder
   - Open `index.html` in your web browser
   - Or serve it using a local server:

     ```bash
     # Using Python 3
     python -m http.server 3000

     # Using Node.js (if you have http-server installed)
     npx http-server -p 3000
     ```

3. **Access the Application**:
   - Open your browser and go to `http://localhost:3000` (if using a server)
   - Or simply open the `index.html` file directly

## Usage

### 1. Authentication

- **Register**: Create a new account with name, email, phone, and password
- **Login**: Sign in with your email and password
- **Logout**: Click the logout button to sign out

### 2. Activities

- **View Activities**: See all available activities with details
- **Add Activity**: Create new activities (title, description, location, date, time)
- **Book Activity**: Click "Book Now" to reserve an activity

### 3. Bookings

- **View My Bookings**: See all your booked activities
- **Booking Details**: Each booking shows activity information and booking date

## API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create new activity
- `POST /api/bookings/book` - Book an activity
- `GET /api/bookings/my-bookings` - Get user's bookings

## File Structure

```
client/
├── index.html      # Main HTML file
├── styles.css      # CSS styles
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- Make sure the backend server is running on port 8000
- The frontend uses localStorage to persist authentication tokens
- All API calls include proper error handling and user feedback
- The UI is fully responsive and works on mobile devices

# Travel Planner

AIzaSyBcoAYJ2Hkxp1e-aBBRsFKFTmj8zYKKemQ == apio key

A comprehensive travel planning application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- Search for travel destinations and get trip suggestions
- Check the weather of travel destinations
- Expense tracking for trips
- Language translation to overcome language barriers
- Book hotels and flights
- Trip management (create, update, delete trips)
- User authentication and authorization

## Tech Stack

- **Frontend**: React, React Router, Axios, Material-UI
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **APIs**: Weather API, Translation API, Flight and Hotel Booking APIs

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/travel-planner.git
   cd travel-planner
   ```

2. Install backend dependencies:

   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `server` directory
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     WEATHER_API_KEY=your_openweathermap_api_key
     TRANSLATOR_API_KEY=your_translator_api_key
     FLIGHT_API_KEY=your_flight_api_key
     HOTEL_API_KEY=your_hotel_api_key
     ```

### Running the Application

1. Start the backend server:

   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend:

   ```bash
   cd ../client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/profile` - Get user profile

### Trips

- `POST /api/trips` - Create a new trip
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id` - Update a trip
- `DELETE /api/trips/:id` - Delete a trip

### Weather

- `GET /api/weather/current/:location` - Get current weather for a location
- `GET /api/weather/forecast/:location` - Get 5-day forecast for a location

### Expenses

- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/trip/:tripId` - Get all expenses for a trip
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/expenses/summary/:tripId` - Get expense summary by category for a trip

### Translation

- `POST /api/translator/translate` - Translate text
- `GET /api/translator/languages` - Get supported languages

### Booking

- `POST /api/booking/flights/search` - Search for flights
- `POST /api/booking/hotels/search` - Search for hotels
- `POST /api/booking/flights/book` - Book a flight
- `POST /api/booking/hotels/book` - Book a hotel

## Future Enhancements

- Social sharing of trips
- Trip itinerary generation using AI
- Travel recommendations based on user preferences
- Push notifications for trip reminders
- Travel insurance integration
- Public transportation information

## License

This project is licensed under the MIT License - see the LICENSE file for details.

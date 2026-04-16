# ✈️ PackGo — Smart Travel Planner

<div align="center">

![MERN](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-v6-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A full-featured travel planning application built with the MERN stack.**  
Plan trips, track expenses, check weather, translate languages, and search flights & hotels — all in one place.

</div>

---

## 📸 Screenshots

| Landing Page | Dashboard | Trip Detail |
|:---:|:---:|:---:|
| Editorial-style homepage with destination grid | Analytics dashboard with trip stats & charts | Detailed trip view with budget tracking |

| Expense Tracker | Weather Forecast | Live Translator |
|:---:|:---:|:---:|
| Pie chart breakdown with CSV export | 5-day forecast with travel tips | Powered by Google Translate API |

---

## ✨ Features

### 🗺️ Trip Management
- Create, edit, and delete trips with destination autocomplete
- Status tracking — Planned, Ongoing, Completed
- Trip images fetched automatically from destination database
- Budget allocation per trip

### 💰 Expense Tracker
- Add expenses by category — Food, Transport, Accommodation, Activities, Shopping
- Budget utilization progress bar with overspend alerts
- Category-wise spending breakdown with interactive pie charts
- **Export expenses to CSV** for offline records

### 🌤️ Weather Forecast
- Real-time weather data powered by **OpenWeatherMap API**
- 5-day forecast with weather icons
- Smart travel tips based on temperature and conditions

### 🌐 Live Translator
- Instant text translation powered by **Google Translate API** (`google-translate-api-x`)
- 28+ languages supported including Hindi, Spanish, French, Japanese, Arabic
- Auto language detection
- Common travel phrases quick-select
- Copy to clipboard with one click

### ✈️ Flight & Hotel Booking
- Search flights by origin, destination, and dates
- Search hotels by location, check-in/check-out, and guests
- Visual flight timeline with airline info and pricing
- Hotel cards with ratings, amenities, and booking CTA
- *(Currently uses mock data — designed for real API integration)*

### 🔐 Authentication & Security
- JWT-based authentication with token auto-refresh
- Secure password hashing with `bcryptjs`
- Protected routes with middleware guard
- Profile management and password change
- Security headers via `helmet` + API rate limiting

### 📊 Dashboard Analytics
- Trip statistics — Total, Completed, Planned, Budget overview
- Total spending analytics across all trips
- Monthly trip distribution bar chart (Recharts)
- Quick action cards for navigation
- Upcoming trip cards with status badges

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI framework |
| **Redux + Thunk** | Global state management with async actions |
| **React Router v7** | Client-side routing with nested layouts |
| **Material-UI v6** | Pre-built UI components and theming |
| **Recharts** | Data visualization (Bar & Pie charts) |
| **Axios** | HTTP client with JWT interceptors |
| **React-Toastify** | Toast notification system |
| **Leaflet** | Interactive maps |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server |
| **MongoDB + Mongoose** | NoSQL database with schema validation |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **helmet** | Security HTTP headers |
| **express-rate-limit** | API rate limiting (100 req/15min) |
| **google-translate-api-x** | Free Google Translate integration |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
travel-planner/
├── client/                          # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── PrivateRoute.js      # Auth route guard
│       ├── pages/
│       │   ├── Home.js              # Landing page (Wander design)
│       │   ├── Home.css             # Landing page styles
│       │   ├── Login.js             # Login with image carousel
│       │   ├── Register.js          # Multi-step registration
│       │   ├── Dashboard.js         # Dashboard layout + sidebar
│       │   ├── NotFound.js          # 404 page
│       │   └── dashboard/
│       │       ├── DashboardHome.js  # Analytics overview
│       │       ├── TripsView.js      # Trip list + create modal
│       │       ├── TripDetail.js     # Trip detail + expenses
│       │       ├── ExpensesView.js   # Expense tracker + pie chart
│       │       ├── BookingView.js    # Flight & hotel search
│       │       ├── WeatherView.js    # Weather forecast
│       │       ├── TranslatorView.js # Live translator
│       │       └── ProfileView.js    # Profile & password
│       ├── redux/
│       │   ├── store.js
│       │   ├── actions/             # Async thunk actions
│       │   ├── reducers/            # State reducers
│       │   └── types/               # Action type constants
│       ├── services/
│       │   └── api.js               # Axios instance + interceptors
│       ├── theme.js                 # MUI theme (Poppins font)
│       ├── App.js                   # Root component + routes
│       └── index.js                 # Entry point
│
├── server/                          # Express Backend
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile
│   │   ├── tripController.js        # Trip CRUD operations
│   │   ├── expenseController.js     # Expense CRUD + aggregation
│   │   ├── weatherController.js     # OpenWeatherMap integration
│   │   ├── translatorController.js  # Google Translate integration
│   │   └── bookingController.js     # Flight & hotel (mock)
│   ├── models/
│   │   ├── User.js                  # User schema + password methods
│   │   ├── Trip.js                  # Trip schema with nested objects
│   │   ├── Expense.js               # Expense schema linked to trips
│   │   └── Destination.js           # Destination catalog schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trips.js
│   │   ├── expenses.js
│   │   ├── weather.js
│   │   ├── translator.js
│   │   ├── booking.js
│   │   └── destinations.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   └── errorHandler.js          # Global error handler
│   ├── data/
│   │   ├── seed.js                  # Database seeder
│   │   └── cleanAndSeed.js          # Clean + reseed script
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- **npm** (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/hitesh-kumar123/Travel-Plans-.git
cd travel-planner
```

### 2. Install Dependencies

```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/travel-planner
JWT_SECRET=your_super_secret_jwt_key_here
WEATHER_API_KEY=your_openweathermap_api_key
```

> **Note:** The translator uses `google-translate-api-x` which requires **no API key**.  
> Get a free weather API key from [OpenWeatherMap](https://openweathermap.org/api).

### 4. Seed the Database (Optional)

```bash
cd server
node data/seed.js
```

This populates the destinations collection with sample travel destinations.

### 5. Run the Application

```bash
# Terminal 1 — Start the backend (port 5000)
cd server
npm run dev

# Terminal 2 — Start the frontend (port 3000)
cd client
npm start
```

Open your browser at **http://localhost:3000**

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |
| `PUT` | `/api/auth/change-password` | Change password | ✅ |

### Trips
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/trips` | Create a new trip | ✅ |
| `GET` | `/api/trips` | Get all user trips | ✅ |
| `GET` | `/api/trips/:id` | Get trip by ID | ✅ |
| `PUT` | `/api/trips/:id` | Update a trip | ✅ |
| `DELETE` | `/api/trips/:id` | Delete a trip | ✅ |

### Expenses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/expenses` | Get all user expenses (analytics) | ✅ |
| `POST` | `/api/expenses` | Create a new expense | ✅ |
| `GET` | `/api/expenses/trip/:tripId` | Get expenses for a specific trip | ✅ |
| `GET` | `/api/expenses/:id` | Get expense by ID | ✅ |
| `PUT` | `/api/expenses/:id` | Update an expense | ✅ |
| `DELETE` | `/api/expenses/:id` | Delete an expense | ✅ |
| `GET` | `/api/expenses/summary/:tripId` | Expense summary by category | ✅ |

### Weather
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/weather/current/:location` | Current weather for a city | ❌ |
| `GET` | `/api/weather/forecast/:location` | 5-day weather forecast | ❌ |

### Translator
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/translator/translate` | Translate text between languages | ❌ |
| `GET` | `/api/translator/languages` | Get supported language list | ❌ |

### Destinations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/destinations` | Get all destinations | ❌ |
| `GET` | `/api/destinations/search?q=` | Search destinations by name | ❌ |
| `GET` | `/api/destinations/:id` | Get destination by ID | ❌ |

### Booking
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/booking/flights/search` | Search available flights | ✅ |
| `POST` | `/api/booking/hotels/search` | Search available hotels | ✅ |
| `POST` | `/api/booking/flights/book` | Book a flight | ✅ |
| `POST` | `/api/booking/hotels/book` | Book a hotel | ✅ |

---

## 🔒 Security Features

- **JWT Authentication** — Stateless token-based auth with 24h expiry
- **Password Hashing** — bcrypt with salt rounds for secure storage
- **Helmet.js** — Sets security-related HTTP headers
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **CORS** — Configured cross-origin policy
- **Input Validation** — Server-side validation on all routes
- **Protected Routes** — Frontend `PrivateRoute` component + backend `auth` middleware

---

## 🎨 Design Highlights

- **Custom MUI Theme** — Poppins typography, custom palette, rounded components
- **Editorial Landing Page** — Playfair Display + DM Sans typography, SVG illustrations
- **Responsive Design** — Mobile-first sidebar navigation with drawer
- **Micro-animations** — Hover effects, card transitions, loading spinners
- **Toast Notifications** — Real-time feedback on all user actions
- **Interactive Charts** — Bar chart for trip analytics, pie chart for expenses

---

## 🗄️ Database Models

### User
```javascript
{ name, email, password, createdAt }
```

### Trip
```javascript
{ user, destination, startDate, endDate, description, budget, status,
  activities[], accommodation{}, transportation{}, images[], notes }
```

### Expense
```javascript
{ user, trip, amount, currency, category, description, date }
```

### Destination
```javascript
{ name, city, state, category, description, images[],
  entrance_fee_inr, best_time_to_visit, rating }
```

---

## 🔮 Future Enhancements

- [ ] Real flight & hotel API integration (Amadeus / Skyscanner)
- [ ] AI-powered itinerary generation
- [ ] Social trip sharing with friends
- [ ] Push notifications for trip reminders
- [ ] Offline mode with service workers
- [ ] Travel insurance integration
- [ ] Multi-currency expense conversion
- [ ] Trip photo gallery with uploads
- [ ] Collaborative trip planning

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Hitesh Kumar](https://github.com/hitesh-kumar123)**

⭐ Star this repo if you found it useful!

</div>

# Travel Planner API Documentation

This document describes the API endpoints, authentication mechanisms, and request/response structures for the Travel Planner backend services.

## Authentication

Authentication is handled via JSON Web Tokens (JWT). Most routes (except registration, login, forgot password, and reset password) require the token to be sent in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

### Register User
* **Endpoint**: `POST /api/auth/register`
* **Description**: Registers a new user.
* **Request Body**:
  ```json
  {
    "username": "traveler123",
    "email": "traveler@example.com",
    "password": "StrongPassword123"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "username": "traveler123",
      "email": "traveler@example.com"
    }
  }
  ```

### Login User
* **Endpoint**: `POST /api/auth/login`
* **Description**: Logs in an existing user.
* **Request Body**:
  ```json
  {
    "email": "traveler@example.com",
    "password": "StrongPassword123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "username": "traveler123",
      "email": "traveler@example.com"
    }
  }
  ```

---

## 2. Trip Endpoints (`/api/trips`)

All trip endpoints require authentication.

### Get All Trips
* **Endpoint**: `GET /api/trips`
* **Response (200 OK)**:
  ```json
  [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Summer Vacation in Tokyo",
      "destination": "Tokyo, Japan",
      "startDate": "2026-07-01T00:00:00.000Z",
      "endDate": "2026-07-15T00:00:00.000Z",
      "user": "60d0fe4f5311236168a109ca"
    }
  ]
  ```

### Create a Trip
* **Endpoint**: `POST /api/trips`
* **Request Body**:
  ```json
  {
    "title": "Summer Vacation in Tokyo",
    "destination": "Tokyo, Japan",
    "startDate": "2026-07-01",
    "endDate": "2026-07-15"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "_id": "60d0fe4f5311236168a109cb",
    "title": "Summer Vacation in Tokyo",
    "destination": "Tokyo, Japan",
    "startDate": "2026-07-01T00:00:00.000Z",
    "endDate": "2026-07-15T00:00:00.000Z"
  }
  ```

---

## 3. Weather Endpoints (`/api/weather`)

### Get Current & Forecast Weather
* **Endpoint**: `GET /api/weather?city=Tokyo`
* **Response (200 OK)**:
  ```json
  {
    "city": "Tokyo",
    "temp": 24,
    "description": "Partly cloudy",
    "forecast": [
      { "day": "Monday", "temp": 25, "condition": "Sunny" },
      { "day": "Tuesday", "temp": 23, "condition": "Rainy" }
    ]
  }
  ```

---

## 4. Error Responses

In case of error, the API returns a structured JSON payload:

```json
{
  "msg": "Invalid token"
}
```

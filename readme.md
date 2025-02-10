# Swissmote

Swissmote is a backend API for event management, allowing users to create, manage, and join events. It provides authentication and user profile management functionalities.

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Events](#events)
- [Authorization](#authorization)
- [Response Structure](#response-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JBadgujar/swissmote.git
   cd swissmote/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:5000`.

## API Endpoints

### Authentication

#### Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "Your Name",
    "email": "your@email.com",
    "password": "yourpassword"
  }
  ```

#### Login User

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "your@email.com",
    "password": "yourpassword"
  }
  ```

### Events

#### Show All Events

- **URL:** `/api/events`
- **Method:** `GET`

#### Create an Event

- **URL:** `/api/events`
- **Method:** `POST`
- **Authorization:** `Bearer Token`
- **Request Body:** (Form Data)
  - `name`: Event name
  - `description`: Event description
  - `date`: Event date (timestamp)
  - `location`: Event location
  - `image`: Event image (file upload)

#### Show Specific Event

- **URL:** `/api/events/:id`
- **Method:** `GET`

#### Update Event

- **URL:** `/api/events/:id`
- **Method:** `PUT`
- **Authorization:** `Bearer Token`
- **Request Body:** (Form Data)
  - `name`, `description`, `date`, `location`

#### Join Event

- **URL:** `/api/events/:id/join`
- **Method:** `POST`
- **Authorization:** `Bearer Token`

#### Delete Event

- **URL:** `/api/events/:id`
- **Method:** `DELETE`
- **Authorization:** `Bearer Token`

## Authorization

Most routes require authentication using a **Bearer Token**. Include the token in the `Authorization` header:

```http
Authorization: Bearer YOUR_TOKEN
```

## Response Structure

Most responses return JSON with structured data. Example for fetching events:

```json
[
  {
    "_id": "event_id",
    "name": "Event Name",
    "description": "Event Description",
    "date": "timestamp",
    "location": "Event Location",
    "image": "image_url",
    "organizer": {
      "_id": "user_id",
      "name": "Organizer Name",
      "email": "email@example.com"
    },
    "attendees": ["user_id"],
    "createdAt": "timestamp"
  }
]
```

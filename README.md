# Real Estate Chatbot & Property Recommendation Web App

**Find the perfect property with suggestions based on your preferences.**

--- 
## WebAPP Preview
- Home Page
![Homepage Preview](https://res.cloudinary.com/do1xweis7/image/upload/v1748886201/REAL-ESTATE-AI/Screenshot_2025-06-02_230841_x9cpg4.png)

- ChatBot UI
![ChatBot Preview](https://res.cloudinary.com/do1xweis7/image/upload/v1748886198/REAL-ESTATE-AI/Screenshot_2025-06-02_230932_wqao4d.png)

- Filter
![Filter Page](https://res.cloudinary.com/do1xweis7/image/upload/v1748886198/REAL-ESTATE-AI/Screenshot_2025-06-02_230957_p4enke.png)

- Most Searched Properties Section
![Most Searched Section](https://res.cloudinary.com/do1xweis7/image/upload/v1748886197/REAL-ESTATE-AI/Screenshot_2025-06-02_231042_fkgebb.png)

- Login Page
![Login Page](https://res.cloudinary.com/do1xweis7/image/upload/v1748886812/REAL-ESTATE-AI/Screenshot_2025-06-02_231944_oeiwwk.png)

- User Settings Page
![user Settings page](https://res.cloudinary.com/do1xweis7/image/upload/v1748886812/REAL-ESTATE-AI/Screenshot_2025-06-02_232134_tjjf2p.png)

---

## Table of Contents

- [Real Estate Chatbot \& Property Recommendation Web App](#real-estate-chatbot--property-recommendation-web-app)
  - [WebAPP Preview](#webapp-preview)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features \& Functionality](#features--functionality)
  - [Technology Stack](#technology-stack)
  - [Prerequisites](#prerequisites)
  - [Installation \& Setup](#installation--setup)
  - [Approach \& Architecture](#approach--architecture)
  - [Challenges \& Learned](#challenges--learned)

---

## Project Overview

This web application helps users **find their perfect property** by combining:

- A **React.js**-based frontend (powered by Vite & Tailwind CSS)  
- A **Node.js + Express.js** backend  
- **MongoDB** for storing property data  
- **Redis** (via Docker) for caching recent searches & property recommendations  
- A chat-bot interface for conversational property search (utilizing AI to extract user preferences)  

Users can interact with a chatbot UI to specify criteria (location, budget, bedrooms, amenities, etc.) and get a curated list of property suggestions. The backend caches frequently requested filters in Redis to speed up subsequent lookups.

---

## Features & Functionality

- **Conversational Search**  
  - Chatbot prompts users for property preferences  
  - AI-powered intent extraction (filters like location, budget, size, amenities)  
- **Property Recommendations**  
  - Searches MongoDB for matching properties  
  - Caches results in Redis to accelerate repeat queries  
- **Admin Import Utility**  
  - `importProperties.js` script (in `/server`) to bulk-import property data into MongoDB  
- **User-Friendly Frontend**  
  - Built with React, Vite, Tailwind CSS  
  - Real-time chat interface with scrolling messages  
  - Property cards layout showing key details  
- **Backend API**  
  - RESTful endpoints under `/server/api/...`  
  - Middlewares for authentication, validation, and caching  
- **Dockerized Redis**  
  - Spin up a Redis container locally to cache search results  

---

## Technology Stack

- **Frontend**  
  - React 18 (via Vite)  
  - Tailwind CSS (utility-first styling)  
  - React Router (client-side routing)  
  - Axios / Fetch for HTTP calls  
- **Backend**  
  - Node.js (v16+) & Express.js  
  - MongoDB (v5+) with Mongoose ODM  
  - Redis (v7+) for in-memory caching (run via Docker)  
  - dotenv (environment variable management)  
  - JSON Web Tokens (JWT) for authentication (if extended)  
- **Utilities / Dev Tools**  
  - ESLint (code linting)  
  - nodemon (auto-restart on file changes)  
  - Vite (fast frontend dev server)  
  - Docker (to run Redis)  

---

## Prerequisites

Before running this project locally, make sure you have:

1. **Node.js & npm** (v16+)  
2. **MongoDB**  
   - Install MongoDB locally or use a hosted MongoDB Atlas cluster.  
3. **Docker** (for Redis)  
   - Alternatively, you can install & run Redis locally, but Docker is recommended.  
4. **Git** (to clone the repository)  

---
## Installation & Setup

- **1. Clone the Repository**

```ini
git clone https://github.com/neerajsde/Real-Estate-Chatbot.git
cd Real-Estate-Chatbot
```
- **2. Backend Setup**
  
```ini
cd server
npm install
npm run refersh # Optional for save Properties Data into DB and merge files
npm run dev
```

- **3. Redis (Docker) Setup**
 ```ini
docker pull redis:latest
docker run -d --name realestate-redis -p 6379:6379 redis:latest
```

- **4. Frontend Setup**
```ini
cd ..
npm install
npm run dev
```

---
## Approach & Architecture
- **Frontend** (React + Vite + Tailwind)
  - React Router manages different pages (e.g., Home, Recommendations, Saved Properties).
  - **Chatbot Component:**
    - Renders a chat UI (message bubbles, user inputs, send button).
    - On each user message, calls a backend endpoint to extract property filters from natural language.
    - Displays bot replies and suggested recommended page link
  - **PropertyCard Component:**
    - Receives property data (image, price, location, size, bedrooms, amenities).
    - Styled with Tailwind CSS for a responsive, mobile-friendly grid layout.
- **Backend** (Express + MongoDB + Redis)
  - Routes (under `/server/routes`):
    - `/api/chat/search` (POST): Accepts raw user message ➔ Uses a simple NLP/regex (or a lightweight AI integration) to extract structured filters (location, price range, bedrooms, etc.).
    - `/api/properties/search` (POST): Takes JSON filters ➔ Queries MongoDB for matching properties ➔ Checks Redis cache first; if no cache hit, queries MongoDB, then stores results in Redis with a TTL (e.g., 5–10 minutes).
    - `/api/properties/recommend` (GET): Returns “hot” or trending properties (precomputed or based on query logs).
  - Controllers (under `/server/controllers`):
    - `chat.js` (handles filter extraction logic).
    - `property.js` (handles DB queries + caching).
    - `user.js` (handles user login, signup etc.)
  - Models (under `/server/models`):
    - `Property.js`: Mongoose schema with fields like `title`, `location`, `price`, `size`, `bedrooms`, `amenities`, `images`, `createdAt`, etc.
    - `User.js` (if user registration / saved properties are implemented and etc).
    - `savedProperty.js`: user prefferences.

---
## Challenges & Learned
- Natural Language Processing:
  - Challenge: Accurately extracting property preferences from varied user inputs
  - Solution: Combined regex patterns with AI intent recognition

- Cache Management:
    - Challenge: Balancing freshness vs performance for property data
    - Solution: Implemented TTL-based expiration and cache-busting on data updates
  
-  Real-time Chat Experience:
    - Challenge: Maintaining message state during rapid interactions
    - Solution: Optimized React state management with useReducer

- Performance Optimization:
    - Redis caching reduced average query time from 450ms → 12ms
    - Vite's HMR improved frontend development experience

- Containerization Benefits:
    - Docker simplified Redis setup and ensured environment consistency
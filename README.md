
# 🌤️ Weather Forecast App

A responsive weather forecast application built with **Angular 17** and **Node.js**. Get real-time weather updates, weekly forecasts, and much more!

---

## 🚀 Features

- **Current Weather**: View detailed weather data, including temperature, humidity, wind speed, and more.
- **Weekly Forecast**: Access accurate weather predictions for the next 7 days.
- **Historical Weather**: Review weather data from the past week.
- **City Search**: Find weather information for any city worldwide.
- **Geolocation**: Automatically fetch local weather using your device's location.
- **Favorite Cities**: Save and manage favorite locations for quick access.
- **Responsive Design**: Optimized layout for desktops, tablets, and mobile devices.
- **Weather Highlights**: Detailed metrics like UV index, wind direction, atmospheric pressure, etc.

---

## 🛠️ Tech Stack

### Frontend
- **Angular 17**  
- **Angular Material**  
- **TypeScript**  
- **SCSS**  
- **Jest** for unit testing  

### Backend
- **Node.js**  
- **Express**  
- **Jest** for unit testing  

---

## 📡 API Endpoints

- **`GET /weather`** - Retrieve weather data for a specific location.  
- **`GET /cities`** - Search for cities by name.

---

## 🔧 Port Configuration

| **Environment** | **Frontend** | **Backend** |
|-----------------|--------------|--------------|
| Development     | 4200         | 3000         |
| Production      | 8080         | 3000         |

---

## 🐳 Running with Docker

Easily set up and run the application using Docker.

### Development Environment

1. Clone the repository and navigate to the project root:

   ```bash
   git clone https://github.com/RenanRB/weather-forecast
   cd weather-forecast
   ```

2. Start the development containers:

   ```bash
   docker-compose up
   ```

3. Access the application at:  
   - Frontend: [http://localhost:4200](http://localhost:4200)  
   - Backend API: [http://localhost:3000](http://localhost:3000)  

### Production Environment

To deploy the production build:

1. Start the production containers:

   ```bash
   docker-compose -f docker-compose.prod.yml up
   ```

2. Access the application at:  
   - Frontend: [http://localhost:8080](http://localhost:8080)  
   - Backend API: [http://localhost:3000](http://localhost:3000)  

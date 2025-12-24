# JobJob 

JobJob is a modern recruitment platform designed to connect candidates with opportunities using advanced matching algorithms. The project consists of a React-based frontend, a Node.js/Express backend, and a specialized Python matching engine.

## 🚀 Project Structure

The project is organized into three main components:

- **client/**: The frontend application built with React, Vite, and Tailwind CSS.
- **server/**: The backend API built with Node.js, Express, and MongoDB.
- **matching-engine/**: The data science component for intelligent job matching (Python).

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Python](https://www.python.org/) (3.8 or higher)

## 🏁 Getting Started

### 1. Server Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with URI i have send to you


Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

### 2. Client Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### 3. Matching Engine Setup

Navigate to the matching engine directory:

```bash
cd matching-engine
```

(Optional) Create a virtual environment:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run the engine:

```bash
python main.py
```

## ✨ Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Token (JWT)
- **AI/DS**: Python (Matching Engine)


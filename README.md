# 🖊️ White-Board Application

A feature-rich, full-stack whiteboard application built using the **MERN (MongoDB, Express.js, React, Node.js)** stack. This tool allows users to draw, sketch, save their creations to a cloud database, and reload them anytime.

---

## 🚀 Live Demo

-   **Frontend (Vercel):** **[https://white-board-rose.vercel.app/](https://white-board-rose.vercel.app/)**
-   **Backend API (Render):** **[https://white-board-2kl6.onrender.com/api/drawings](https://white-board-2kl6.onrender.com/api/drawings)**



---

## ✨ Features

### Frontend
-   🖌️ Freehand drawing with multiple tools
-   🎨 Stroke color and fill color selection
-   🔲 Shape tools (line, rectangle, circle, arrow)
-   ➕ Add text annotations
-   🔁 Undo/Redo support
-   🗑️ Clear entire canvas
-   🌗 Dark mode UI styled with Tailwind CSS

### Backend & Full-Stack
-   ☁️ **Save Drawings:** Save your canvas creations to a MongoDB Atlas cloud database.
-   🖼️ **Drawing Gallery:** View all your saved drawings in a live-updating gallery.
-   🔄 **Load Drawings:** Click on any drawing in the gallery to load it back onto the canvas.
-   ❌ **Delete Drawings:** Delete any saved drawing from the gallery and the database permanently.
-   💾 **Download:** Export the current canvas as a PNG file.

---

## 💻 Tech Stack

-   **Frontend:** React.js, React Context API, Axios
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB Atlas, Mongoose
-   **Canvas Manipulation:** HTML5 Canvas API
-   **Styling:** Tailwind CSS, CSS Modules
-   **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🛠️ Installation and Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites
-   Node.js installed on your machine.
-   A free MongoDB Atlas account and your connection string (MONGO_URI).

### 1. Clone the Repo
```bash
git clone https://github.com/shivanshjoshi08/White-Board-Application.git
cd White-Board-Application
```

### 2. Backend Setup
```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# Create a .env file in the 'server' directory
# Add your MongoDB connection string to it
echo "MONGO_URI=your_mongodb_connection_string" > .env
```

### 3. Frontend Setup
```bash
# Navigate back to the root directory
cd ..

# Install frontend dependencies
npm install

# Create a .env file in the root directory for the frontend
# This tells the frontend where the backend is running
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

### 4. Running the Application
You will need to run the backend and frontend in two separate terminals.

**Terminal 1 (Backend):**
```bash
# From the root directory, navigate to server
cd server

# Start the backend server
npm start
```

**Terminal 2 (Frontend):**
```bash
# From the root directory
npm start
```
Your application should now be running at `http://localhost:3000`.

---

## 📁 Final Project Structure

```
.
├── server/
│   ├── models/
│   │   └── Drawing.js
│   ├── routes/
│   │   └── drawings.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── src/
│   ├── components/
│   │   ├── Board/
│   │   ├── Gallery/
│   │   ├── Toolbar/
│   │   └── Toolbox/
│   │
│   ├── store/
│   │   └── BoardProvider.js
│   │
│   ├── App.js
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and share.

---

## 🤝 Contributions

Pull requests and suggestions are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 👨‍💻 Author

**SHIVANSH JOSHI**
-   **GitHub:** [shivanshjoshi08](https://github.com/shivanshjoshi08)

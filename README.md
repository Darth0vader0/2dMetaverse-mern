# 🏢 2D Meta Office (MERN + Phaser)

A real-time **2D virtual office** built for remote collaboration using **React**, **Phaser**, **Node.js**, **MongoDB**, and **Socket.io**.

> 🚀 Collaborate. Customize. Co-exist — in a 2D metaverse workspace!

---

## ✨ Features

- 🔐 **User Authentication** – Sign up, log in, and manage your profile securely  
- 🧑‍🎨 **Avatar Customization** – Choose your avatar and show your style  
- 🏢 **Metaverse Spaces** – Create or join virtual office rooms  
- 🎮 **2D Office Game** – Move around, find your chair, and interact in real time  
- 🪑 **Assigned Seating** – Each user gets a unique chair; navigation arrow helps locate it  
- 🌐 **Real-Time Multiplayer** – See teammates moving and sitting live  
- 📊 **Modern Dashboard** – View stats, player list, and more  
- 🛡️ **Immersive Security** – Blocks dev tools and right-click for full-screen focus  

---

## 🛠️ Tech Stack

**Frontend**  
⚛️ React • 🎮 Phaser • 🌐 Socket.io-client • 🔀 React Router

**Backend**  
🟢 Node.js • 🚂 Express • 🍃 MongoDB • 🔄 Socket.io

**Styling**  
💨 Tailwind CSS (or your preferred CSS framework)

---

## 🚀 Getting Started

### 1. 📥 Clone the repository

```bash
git clone https://github.com/Darth0vader0/2dmeta-mern.git
cd 2dmeta-mern
```

### 2. 📦 Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. 🧪 Set environment variables

- **Backend:** Create a `.env` file in `/backend` with the following content:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

- **Frontend:** Create a `.env` file in `/frontend` with:

```env
VITE_BACKEND_URL=http://localhost:5000
```

> 📝 Adjust ports and secrets as needed.

### 4. 🏁 Run the app

```bash
# In /backend
npm start

# In /frontend (new terminal)
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to explore your virtual office!

---

## 📁 Project Structure

```
/backend         # Express server, Socket.io, MongoDB models
/frontend
  /src
    /pages       # React pages (home, login, metaverse, game, settings)
    /hooks       # Phaser game logic (e.g. officeMap.js)
    /components  # Reusable UI components
    /assets      # Game sprites, maps, audio, etc.
```

---

## 🎮 Gameplay Flow

1. 👤 **Login or Sign Up**
2. 🏠 **Join or Create a Virtual Office**
3. 🕹️ **Enter the Game:**
   - Move using **Arrow Keys** or **WASD**
   - 🧭 An arrow guides you to your **assigned chair**
   - Press `E` to **Sit** (only at your assigned spot)
   - Watch others in real-time
4. 🚪 **Exit** the game to return to the metaverse lobby

---

## 🧩 Customization

- 🧍 **Add New Avatars:**  
  Drop new sprite sheets in:  
  `/frontend/public/avatars/animation_frames/`

- 🗺️ **Edit the Map:**  
  Use [Tiled Map Editor](https://www.mapeditor.org/)  
  and update:  
  `/frontend/public/assets/tiledMap/officeMapFinal.json`

- 🔧 **Add New Features:**  
  Extend **Socket.io** events, enable **chat**, or add **mini-games**!

---

## 🤝 Contributing

We 💙 contributions!  
Please fork the repo and submit a pull request.  
For major changes, open an issue first to discuss what you'd like to improve.

---

## 📄 License

[MIT License](LICENSE) – Free for personal and commercial use.

---

> **Made with ❤️ for virtual collaboration and community spirit.**

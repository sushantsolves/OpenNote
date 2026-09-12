# OpenNote

A modern, secure and minimal note-taking web application built for organizing ideas, study notes and personal knowledge.

OpenNote is the redesigned evolution of the original **SR WORLD** project, rebuilt with a cleaner architecture and a modern productivity-focused interface.

---

## ✨ Features

- 🔐 Firebase Email/Password Authentication
- 📝 Create and manage notes
- 📁 Organize notes using folders
- 💾 Cloud-based note storage with Firestore
- 🗑️ Delete notes and folders
- ⚡ Fast and lightweight frontend
- 🌙 Modern dark-themed interface
- 📱 Responsive design
- ⌨️ `Ctrl + S` shortcut for saving notes
- 🔔 Toast notifications
- 🪟 Reusable modal system
- 🔄 Persistent authentication state

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES Modules)

### Backend / Cloud

- Firebase Authentication
- Firebase Firestore

### Deployment

- Vercel

---

## 📂 Project Structure

```text
OpenNote/
│
├── index.html
│
├── assets/
│   ├── images/
│   │   └── background.jpg
│   └── icons/
│
├── css/
│   ├── global.css
│   ├── auth.css
│   ├── animations.css
│   ├── dashboard.css
│   ├── dashboard-responsive.css
│   ├── sidebar.css
│   ├── notes.css
│   └── components.css
│
├── js/
│   ├── firebase/
│   │   ├── firebase-config.js
│   │   ├── auth.js
│   │   └── firestore.js
│   │
│   ├── auth/
│   │   ├── login.js
│   │   ├── signup.js
│   │   └── auth-ui.js
│   │
│   ├── dashboard/
│   │   ├── dashboard.js
│   │   ├── dashboard-ui.js
│   │   ├── folders.js
│   │   └── notes.js
│   │
│   ├── components/
│   │   ├── modal.js
│   │   ├── toast.js
│   │   └── loader.js
│   │
│   └── app.js
│
├── README.md
├── .gitignore
├── LICENSE
└── vercel.json
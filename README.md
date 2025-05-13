# 📚 BookBuddy

A MERN stack web application where diploma students can upload, sell, and buy used books.  
Built using **Next.js (App Router)**, **Tailwind CSS**, **Redux**, **ShadCN UI**, and **MongoDB**.

---

## 🚀 Features

- 👤 Student profiles with image & video upload of books
- 📘 Upload and manage book listings
- 🔍 Browse books by year and department
- 💰 Set price for each book
- 🎥 Optional book preview video
- 💾 Fully integrated with MongoDB (backend API coming soon)

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Redux Toolkit, ShadCN UI
- **Backend:** Node.js, Express (coming soon)
- **Database:** MongoDB (with Mongoose)
- **State Management:** Redux Toolkit

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/bookbuddy.git
cd bookbuddy
2. Install Dependencies
bash
Copy
Edit
npm install
3. Set Up Environment Variables
Create a .env.local file in the root of your project and add the following:

env
Copy
Edit
MONGODB_URI=mongodb+srv://<your_mongodb_uri>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
Replace <your_mongodb_uri> with your actual MongoDB connection string.

🧑‍💻 Running the App
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 to view the app.

🧪 Folder Structure
bash
Copy
Edit
bookbuddy/
├── public/              # Public assets like images
├── src/
│   ├── app/             # Next.js app directory (App Router)
│   │   ├── layout.jsx
│   │   ├── page.jsx     # Home page
│   ├── components/      # UI components (e.g., BookCard)
│   ├── redux/           # Redux store & slices
│   ├── styles/          # Tailwind and global CSS
├── .env.local           # Environment variables
├── tailwind.config.js
├── next.config.js
└── README.md
🧠 Contributing
Fork the repository

Create a new branch (git checkout -b feature/your-feature-name)

Commit your changes (git commit -m 'Add something')

Push to the branch (git push origin feature/your-feature-name)

Open a Pull Request 🚀

👥 Team
👨‍💻 [Your Name]

👨‍💻 [Teammate 1]

👩‍💻 [Teammate 2]

📃 License
MIT License
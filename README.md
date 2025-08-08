# WakaMate AI

WakaMate AI is an advanced, AI-powered delivery, logistics, and management platform designed for small business owners. Our mission is to help you optimize delivery routes, manage logistics, and streamline operations—saving you time, reducing costs, and boosting your business growth.

---

## Table of Contents

- [About WakaMate AI](#about-wakamate-ai)
- [Features](#features)
- [How It Works](#how-it-works)
- [Frameworks & Technologies Used](#frameworks--technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Values](#core-values)
- [Team](#team)
- [FAQ](#faq)
- [License](#license)
- [Contributing](#contributing)

---

## About WakaMate AI

Founded in 2025 by a passionate team, WakaMate AI started with a vision to empower small business owners through smart, accessible technology. Our platform leverages AI to deliver cutting-edge solutions in logistics and business management, making modern tools accessible to everyone.

---

## Features

- **AI-Driven Delivery Optimization:** Get the best delivery routes for your products, minimizing costs and delays.
- **Business Management:** Easily add/manage products, suppliers, delivery areas, and more.
- **Secure Authentication:** Robust user registration, login, and email verification.
- **User-Friendly Interface:** Modern UI built for speed and usability, accessible even on low-end devices.
- **Data Security:** Bank-level encryption to keep your business data safe and private.
- **Free Core Features:** No hidden fees for small business owners (premium upgrades coming soon).

---

## How It Works

1. **Create an Account & Sign In**  
   Register your business in minutes and get instant access to WakaMate AI's tools.

2. **Set Up Your Business**  
   Add your products, suppliers, and delivery areas to customize your dashboard and workflows.

3. **Start Growing**  
   Use WakaMate's AI-powered tools to optimize your operations, streamline logistics, and increase profits.

---

## Frameworks & Technologies Used

### Frontend

- **React**: Component-based UI library for building dynamic user experiences.
- **Vite**: Lightning-fast build tool and development server for modern JavaScript projects.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **ESLint**: Linting tool for code quality and consistency.
- **Framer Motion**: Animation library for React.
- **React Router**: Declarative routing for React apps.

### Backend

- **Node.js & Express**: Server-side JavaScript runtime and web framework.
- **MongoDB**: NoSQL database for scalable data storage.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT (jsonwebtoken)**: Secure authentication and authorization.
- **bcrypt**: Password hashing for secure user credentials.
- **Helmet**: Security middleware for HTTP headers.
- **CORS**: Enable cross-origin requests.
- **Morgan**: HTTP request logger.
- **Express Rate Limit**: Middleware to limit repeated requests.
- **dotenv**: Environment variable management.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Backend Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/Oloyede-Michael/WakaMate-AI.git
    cd WakaMate-AI/wakamate_backend
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Configure environment variables**  
   Create a `.env` file with your MongoDB connection string and JWT secret:
    ```
    MONGO_URI=your_mongodb_connection_uri
    JWT_SECRET=your_secret_key
    ```
4. **Start the backend server**
    ```bash
    npm start
    ```
   The backend will run on `http://localhost:1050`.

### Frontend Setup

1. **Navigate to the frontend directory**
    ```bash
    cd ../wakamate_frontend
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Start the frontend development server**
    ```bash
    npm run dev
    ```
   The frontend will run on `http://localhost:5173`.

---

## Project Structure

```
WakaMate-AI/
├── wakamate_backend/    # Node.js + Express + MongoDB backend
│   ├── config/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   └── server.js
├── wakamate_frontend/   # React + Vite + Tailwind frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── App.jsx
│   ├── README.md
│   └── ...
├── wakamate_deliver_route/   # Python delivery route microservice
│   ├── configs/
│   └── src/
├── wakamate_inventory_summary/   # Python inventory summary microservice
│   ├── configs/
│   └── src/
└── README.md            # Project documentation (you are here)
```

---

## Core Values

- **Innovation:** We constantly push boundaries to deliver cutting-edge solutions.
- **Collaboration:** Great things happen when diverse minds work together.
- **Passion:** Our love for technology and problem-solving shines through in every project.

---

## Team

Meet the minds behind WakaMate AI:

- **Micheal Oloyede** – Team lead & Full stack Developer  
  Meet our amazing team leader, Michael. A full-stack developer with a passion for building cool and functional projects. He’s not just skilled, he’s also fun, encouraging, and always bringing good energy to the team. Leading by example, Michael makes working together a great experience.
- **Omilabu Wuraola** – Front-end Developer  
  Wuraola is the creative spirit of our team. From animations to clean interfaces, she knows how to turn vision into vibrant web experiences. With a blend of design flair and coding skills, she bridges the gap between aesthetics and functionality. She’s fun, imaginative, and a joy to collaborate with.
- **Abibi Daniella** – Backend Developer  
  Daniella keeps our team organized and on track while also handling the backend magic. She's the calm in the chaos, making sure tasks are done, deadlines are met, and everyone stays focused. With a sharp mind for logic and a knack for structure, se’s the kind of teammate who just gets things done. she is very reliably and efficiently.
- **Eniaiyejuni Raphael** – AI/ML Engineer  
  Raphael is our AI GUY! He handles the AI integration that make our project secure and AI-dependent. Quietly brilliant and deeply focused, he brings technical depth with a cool-headed approach. You can trust him to write clean, reliable code and explain even the complex stuff in simple terms.
- **Emmanuel Damilola** – Product Designer  
  Dami brings our ideas to life with stunning visuals and user-friendly designs. He has a natural talent for combining creativity with functionality, making sure our users always have a great experience. Easy to talk to, collaborative, and super thoughtful .
- **Joseph Bassey** – Designer  
  JOE is a designer with a passion for creating memorable brand experiences and he also brings our ideas to life with stunning visuals and user-friendly designs...an amazing designer and makes magic with figma, canva...you name it and he delivers..

*(More team members can be added here as the project grows!)*

---

## FAQ

**Q: What is WakaMate AI?**  
A: WakaMateAI is an AI-powered delivery, logistics, and management tool designed for small business owners.

**Q: Is WakaMate AI free to use?**  
A: Yes! Our core features are free for small business owners. Premium tools are coming soon.

**Q: Does it work on my small phone?**  
A: Yes! WakaMate AI is a web application but works great on low-end devices.

**Q: Is my business data secure?**  
A: Absolutely. We use bank-level encryption and never share your data with third parties.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contributing

We welcome contributions! Please fork the repo, create your feature branch, and submit a pull request.

For further questions or support, please open an issue or contact the

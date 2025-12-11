# Smart Queue Management System (SQMS)

A full-stack, production-ready Smart Queue Management System designed to eliminate physical queues and optimize service delivery. This project demonstrates a modern, scalable architecture with a focus on real-time features, data analytics, and a seamless user experience.

**Live Demo:** [**SQMS Frontend on Vercel**](https://your-vercel-url.vercel.app)

---

## ✨ Features

- **Real-Time Queue Updates:** Agent dashboards and public displays are updated instantly using WebSockets.
- **Dynamic Token Generation:** Customers can join queues and receive a unique digital token.
- **AI-Powered Wait Time Prediction:** A predictive model estimates wait times based on queue length, time of day, and day of the week.
- **Priority & Agent Routing:** Smart logic to call the next highest-priority customer.
- **Role-Based Access Control:** Differentiated UI and API access for Admins and Agents using JWT.
- **Analytics Dashboard:** Admins can view beautiful graphs (via Recharts) showing weekly performance, peak hours, and average wait times.
- **Dark Mode:** Sleek, user-friendly dark mode toggle for comfortable viewing.
- **QR Code System:** Generate and scan QR codes for touchless status checking.
- **Browser Notifications:** Users get notified when their turn is approaching.
- **Offline Support:** The public-facing "Join Queue" page is available offline using a Service Worker.
- **PDF Report Export:** Admins can export weekly analytics reports as a PDF.
- **Secure & Scalable API:** Built with production best practices including security headers, rate limiting, and CORS.

## 🏛️ System Architecture

The project uses a modern, decoupled architecture with a React frontend, a Node.js backend, and a MongoDB database.

```mermaid
graph TD
    A[Client Browser] -->|HTTPS| B(Vercel CDN);
    B -->|React SPA| A;
    A -->|API Calls (REST & WebSocket)| C(Render Load Balancer);
    C -->|TCP| D[Node.js / Express Server];
    D -->|JWT Auth| D;
    D -->|Real-time Events| E(WebSocket Server);
    E -->|Pushes Updates| A;
    D <-->|Mongoose ODM| F(MongoDB Atlas);

    subgraph "Frontend (Vercel)"
        B
    end

    subgraph "Backend (Render)"
        C
        D
        E
    end

    subgraph "Database (MongoDB Cloud)"
        F
    end
```

## 🛠️ Tech Stack

| Category      | Technology                                                                                                                              |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **Frontend**  | `React`, `Vite`, `Tailwind CSS`, `Framer Motion`, `Axios`, `Zustand`, `Recharts`                                                            |
| **Backend**   | `Node.js`, `Express.js`, `WebSockets (ws)`, `Mongoose`                                                                                    |
| **Database**  | `MongoDB Atlas`                                                                                                                         |
| **Auth**      | `JSON Web Tokens (JWT)`, `Refresh Tokens`, `bcrypt.js`                                                                                    |
| **Deployment**| `Vercel` (Frontend), `Render` (Backend)                                                                                                   |
| **Tooling**   | `ESLint`, `Nodemon`, `jsPDF`                                                                                                              |


## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm
- A local or cloud MongoDB instance (e.g., MongoDB Atlas)

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add the following:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=15m
    JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key
    JWT_REFRESH_EXPIRES_IN=7d
    CORS_ORIGIN=http://localhost:5173
    ```
    Then, run the backend server:
    ```bash
    npm run dev
    ```

3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    The frontend uses Vite, which automatically reads environment variables from a `.env.local` file. Create this file in the `frontend` directory:
    ```env
    VITE_API_BASE_URL=http://localhost:5001
    ```
    Then, run the frontend development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🚢 Deployment

This project is configured for easy deployment on Vercel and Render.

- **Frontend (Vercel):** Connect the GitHub repository to Vercel, set the root directory to `frontend`, and add the `VITE_API_BASE_URL` environment variable pointing to your deployed backend URL.
- **Backend (Render):** Create a new Web Service on Render, set the root directory to `backend`, and configure the environment variables as described in the `.env` section above. Set `CORS_ORIGIN` to your Vercel frontend URL.

## 🔐 Environment Variables

<details>
<summary>Click to view all environment variables</summary>

#### Backend (`.env`)
| Variable                   | Description                                          | Example                                       |
|----------------------------|------------------------------------------------------|-----------------------------------------------|
| `PORT`                     | The port for the backend server to run on.           | `5001`                                        |
| `MONGO_URI`                | The full connection string for your MongoDB Atlas cluster. | `mongodb+srv://user:pass@...`                 |
| `JWT_SECRET`               | A long, random secret for signing access tokens.     | `a_very_long_and_random_string_for_security`  |
| `JWT_REFRESH_SECRET`       | A different secret for signing refresh tokens.       | `another_very_long_secret`                    |
| `JWT_EXPIRES_IN`           | Expiration time for access tokens.                   | `15m`                                         |
| `JWT_REFRESH_EXPIRES_IN`   | Expiration time for refresh tokens.                  | `7d`                                          |
| `CORS_ORIGIN`              | The URL of the frontend allowed to make requests.    | `https://your-frontend.vercel.app`              |

#### Frontend (`.env.local`)
| Variable              | Description                                        | Example                              |
|-----------------------|----------------------------------------------------|--------------------------------------|
| `VITE_API_BASE_URL`   | The base URL for the deployed backend API.         | `https://your-backend.onrender.com`  |

</details>

## 📄 License

This project is licensed under the MIT License.
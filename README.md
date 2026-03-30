# 🚀 SkillSeed: AI-Powered Learning Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

> **Empowering the next generation of learners through AI-native course discovery and intelligent guidance.**

![SkillSeed Banner](https://res.cloudinary.com/dynab60ke/image/upload/v1774808885/Screenshot_2026-03-29_234102_fciq3t.png)

SkillSeed is a sophisticated backend engine for a modern Learning Management System (LMS), engineered with a Focus on **AI-driven interactions** and **semantic course discovery**. It leverages bleeding-edge technologies like Vector Search and LLMs to provide a seamless educational experience for learners, instructors, and administrators alike.

---

## ✨ Features

### 🤖 AI Features (Core Innovation)
*   **AI Course Advisor**: An intelligent chatbot that provides instant answers about course content, pricing, and instructors using RAG (Retrieval-Augmented Generation).
*   **Semantic Search**: Move beyond keyword matching. Our system uses OpenAI embeddings and MongoDB Atlas Vector Search to understand user intent.
*   **Automated Content Vectorization**: Automatically generates and refreshes high-dimensional embeddings for course descriptions to keep search results relevant.

### 👨‍🎓 Learner Features
*   **Rich Course Navigator**: Multi-module lessons with progress tracking and intuitive navigation.
*   **Interactive Assessments**: Integrated quizzes and formal assessments to validate learning.
*   **Automated Certification**: Secure PDF certificate generation upon course completion using `pdf-lib`.
*   **Engagement**: Real-time testimonials and course ratings.

### 👨‍🏫 Instructor Features
*   **Course Architect**: intuitive tools to design complex course structures with modules and lessons.
*   **Financial Hub**: Payout tracking and revenue management via integrated payment gateways.
*   **Content Management**: Support for high-quality video uploads and resource attachments (S3/Cloudinary).

### 🛠 Admin Features
*   **Universal Oversight**: Comprehensive dashboard to manage users, categories, and course approvals.
*   **Global Reporting**: Detailed analytics on course performance, enrollment trends, and financial health.
*   **System Security**: Rate limiting, CSRF protection, and audit logs.

---

## 🧠 AI Capabilities

The "AI" in SkillSeed isn't just a label—it's woven into the architecture:

1.  **Vector Search Pipeline**: When a course is created/updated, our `CourseService` triggers a batch process that sends text data to OpenAI's embedding models (`BAAI/bge-m3`). The resulting vectors are stored in a specialized MongoDB collection.
2.  **Semantic RAG (Chatbot)**: Our chatbot doesn't guess. It performs a **Vector search** in real-time to find the most relevant "chunks" of course data, injects them into the LLM context (OpenRouter/OpenAI GPT-4), and returns a precise, hallucination-free response.
3.  **Smart Intent Detection**: The system intelligently identifies if a user is asking for "total courses", "pricing", or "specific topics" to toggle between mathematical counting and semantic retrieval.

---

## 🏗 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Language** | Node.js (v18+), TypeScript |
| **Framework** | Express.js (v5.1 - Latest Beta) |
| **Database** | MongoDB (Primary), ioredis (Caching/Rate Limiting) |
| **AI/ML** | OpenAI API, MongoDB Atlas Vector Search, OpenRouter |
| **Auth** | JWT (Access/Refresh), Google OAuth 2.0, bcrypt |
| **Storage** | AWS S3 (Videos/Docs), Cloudinary (Images) |
| **Payments** | Stripe Integration |
| **Communication** | Resend API, Nodemailer |
| **Logging** | Winston (Daily Rotation), Morgan |

---

## 🏛 Software Architecture

SkillSeed is built following **Clean Architecture** principles to ensure scalability, maintainability, and testability.

### 🧱 Repository Pattern
The system decouples business logic from data access using the **Repository Pattern**. Services interact with high-level `interfaces`, allowing for easy swapping of database providers or mocking for unit tests.

### 🏗 SOLID Principles
*   **Single Responsibility (S)**: Each layer (Controller, Service, Repository) has one specific reason to change.
*   **Open-Closed (O)**: The system is designed to be extendable via interfaces without modifying core logic.
*   **Liskov Substitution (L)**: All service and repository implementations strictly adhere to their defined interfaces.
*   **Interface Segregation (I)**: Interfaces are lean and feature-specific (e.g., `ICourseService`, `IFileUploadService`).
*   **Dependency Inversion (D)**: High-level modules (Services) depend on abstractions (Interfaces), not low-level implementations (Repositories).

---

## 📂 Folder Structure

```text
src/
├── config/         # SDK Initializations (S3, Cloudinary, OpenAI, Redis)
├── controllers/    # Request handlers (Parsing -> Response)
├── dtos/           # Data Transfer Objects for validation & mapping
├── interfaces/     # Service & Repository abstractions
├── mappers/        # Logic to transform DB entities to Response DTOs
├── middlewares/    # Security, Auth, Error handling, Rate limiting
├── models/         # Mongoose Schemas (User, Course, Enrollment, etc.)
├── repositories/   # Direct Data Access Layers (DAL)
├── routes/         # API Endpoint definitions
├── services/       # Core Business Logic (LMS Logic + AI Pipelines)
├── types/          # Shared TypeScript type definitions
└── utils/          # Helpers (embeddings, PDF gen, async handlers)
```

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/lms-backend.git
cd lms-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and populate it with your credentials (see section below).

### 4. Run Development Server
```bash
npm run dev
```

---

## 🔐 Environment Variables

| Variable | Description |
| :--- | :--- |
| `MONGODB_CONNECTION_STRING` | Your MongoDB Atlas URI with Vector Search enabled |
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | Environment mode (`development` or `production`) |
| `FRONTEND_URL` | URL of the frontend application |
| `JWT_ACCESS_SECRET` | Secret key for access tokens |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |
| `AUTH_SECRET` | General authentication secret |
| `STRIPE_SECRET_KEY` | Stripe secret key for payment processing |
| `OPENROUTER_API_KEY` | API key for AI Chatbot capabilities (GPT-4/LLMs) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for social login |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret access key |
| `AWS_REGION` | AWS region for S3 services |
| `AWS_S3_BUCKET_NAME` | Name of the S3 bucket for video/asset storage |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image hosting |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET_KEY`| Cloudinary API secret |
| `RESEND_API_KEY` | API key for Resend email service |
| `EMAIL_USER` | SMTP email user |
| `EMAIL_PASS` | SMTP email password/app-specific password |
| `REDIS_HOST` | Hostname for the Redis instance |
| `REDIS_PORT` | Port for the Redis instance |
| `REDIS_USERNAME` | Username for Redis authentication |
| `REDIS_PASSWORD` | Password for Redis authentication |

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/user/register` | User sign-up (Learner/Instructor) |
| **POST** | `/api/chatbot/ask` | AI-Powered course advisor query |
| **GET** | `/api/course/all` | Semantic course search with filters |
| **POST** | `/api/enrollment/checkout` | Stripe-powered enrollment flow |
| **POST** | `/api/certificate/generate`| Automated PDF certificate creation |
| **GET** | `/api/report/admin/stats` | Aggregated LMS analytics |

---

## 🧪 Error Handling & Security

*   **Standardized Responses**: Using a custom `AppError` class and `asyncHandler` wrapper to ensure 100% consistent JSON errors.
*   **Security Layers**:
    *   **Helmet.js**: For HTTP header security.
    *   **Rate Limiter**: Brute-force protection on auth endpoints using Redis.
    *   **CSRF Protection**: Native `csurf` implementation.
    *   **JWT Security**: HttpOnly cookie-based storage for Refresh tokens.

## 🚀 Deployment

The project is production-ready and includes Docker support for easy orchestration.

### 🐳 Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### ☁️ Production Notes
- **Process Manager**: Use `pm2` for process management in non-docker environments.
- **Environment**: Ensure `NODE_ENV` is set to `production` to enable optimized logging and security headers.
- **Reverse Proxy**: Recommended to run behind Nginx with SSL termination.

---

## 📸 Screenshots


 **AI Chatbot** 

 ![Placeholder](https://res.cloudinary.com/dynab60ke/image/upload/v1774859327/Screenshot_2026-03-30_135617_ytul53.png) 

---

## 📈 Future Enhancements

*   **Hybrid Learning Paths**: AI-generated personalized paths based on quiz performance.
*   **Multi-Cloud Vector Storage**: Integration with Pinecone for ultra-low latency searches.
*   **Automated Video Subtitles**: Using OpenAI Whisper to generate searchable transcripts for lessons.
*   **WebSocket Notifications**: Real-time alerts for course updates and achievements.

---

## 🤝 Contribution

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


---

*Developed with ❤️ by Amith. If you like this project, please give it a ⭐!*

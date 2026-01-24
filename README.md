# LMS Backend

A robust and scalable Learning Management System (LMS) backend built with TypeScript, designed to power modern educational platforms with comprehensive course management, user authentication, and content delivery capabilities.

## 🚀 Features

### Core Functionality
- **User Management**
  - Role-based access control (Students, Instructors, Admins)
  - Secure authentication and authorization
  - User profile management
  - Password reset and email verification

- **Course Management**
  - Create, update, and delete courses
  - Course categorization and search
  - Course enrollment system
  - Progress tracking

- **Content Delivery**
  - Support for multiple content types (videos, documents, presentations)
  - Structured lecture and module organization
  - File upload and management
  - Resource sharing

- **Assessment & Evaluation**
  - Quiz and assignment creation
  - Automated grading system
  - Grade management and reporting
  - Student performance analytics



## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js ( framework)
- **Database:** MongoDB 
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary / AWS S3
- **Containerization:** Docker

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)
- Database (MongoDB)

## ⚙️ Installation

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/amith2083/LMS-Backend.git
cd LMS-Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/lms_db
# OR for PostgreSQL
# DATABASE_URL=mongodb://username:password@localhost:5432/lms_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=noreply@lms.com
FROM_NAME=LMS Platform

# File Upload Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```


```

4. **Start the development server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Docker Setup

1. **Build the Docker image**
```bash
docker build -t lms-backend .
```

2. **Run the container**
```bash
docker run -p 5000:5000 --env-file .env lms-backend
```

Or use Docker Compose:
```bash
docker-compose up
```

## 📁 Project Structure

```
LMS-Backend/
├── src/
│   ├── config/           # Configuration files (database, env, etc.)
│   ├── constants/        # Application constants and enums
│   ├── controllers/      # Route controllers (business logic handlers)
│   ├── dtos/             # Data Transfer Objects (request/response schemas)
│   ├── interfaces/       # TypeScript interfaces and contracts
│   ├── mappers/          # Data transformation and mapping logic
│   ├── middlewares/      # Custom middleware (auth, validation, error handling)
│   ├── models/           # Database models and schemas
│   ├── repositories/     # Data access layer (database operations)
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic and service layer
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions and helpers
│   └── app.ts            # Application entry point and setup
├── .dockerignore         # Docker ignore file
├── .env                  # Environment variables (not in repo)
├── .gitignore            # Git ignore file
├── Dockerfile            # Docker configuration
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```



```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Docker Deployment
```bash
docker build -t lms-backend:latest .
docker push your-registry/lms-backend:latest
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- XSS protection
- Helmet.js for security headers

## 📊 Performance

- Database query optimization
- Caching strategies (Redis)
- Pagination for large datasets
- Compression middleware
- Connection pooling


### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages


## 📝 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
```




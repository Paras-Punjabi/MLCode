# MLCode - Machine Learning Coding Platform

A microservices-based platform for solving machine learning coding challenges. MLCode combines a modern NextJS frontend with scalable backend services, Kubernetes orchestration, Clerk Authentication, Redis Caching, ExpressJS with PostgreSQL and distributed processing for executing user submissions using.

## 🏗️ Architecture

MLCode follows a **microservices architecture** pattern with the following components:

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend                               │
│                    (Next.js, React, TypeScript)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway Service                          │
│              (Authentication & Request Routing)                 │
└────────────────┬──────────────┬──────────────┬──────────────────┘
                 │              │              │
    ┌────────────▼─┐  ┌─────────▼──┐  ┌───────▼───────┐
    │  Problem     │  │ Submission │  │  Container    │
    │  Service     │  │  Service   │  │  Service      │
    └────────────┬─┘  └─────────┬──┘  └───────┬───────┘
                 │              │              │
    ┌────────────▼──────────────▼──────────────▼────────┐
    │         Shared Infrastructure                      │
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
    │  │ Database │  │  Redis   │  │  MinIO   │  Kafka  │
    │  │(Postgres)│  │ (Caching)│  │ (S3-like)│         │
    │  └──────────┘  └──────────┘  └──────────┘         │
    └──────────────────────────────────────────────────┘
        
    ◄──────────► Kubernetes Orchestration ◄──────────►
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v21+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis (ioredis)
- **Message Queue**: Apache Kafka (kafkajs)
- **Object Storage**: MinIO
- **Container Orchestration**: Kubernetes
- **Authentication**: Clerk
- **Logging**: Winston + Express-Winston

### Frontend
- **Framework**: Next.js (v16)
- **UI Library**: React (v19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn
- **HTTP Client**: Axios
- **Authentication**: Clerk (Next.js)
- **Animation**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Notifications**: Sonner

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Python Worker**: Docker container for notebook execution

---

## 📁 Backend Structure

```
MLCode/
├── backend/
│   ├── k8s/                   
│   ├── micro_services/              
│   │   ├── api-gateway-service/      
│   │   │   ├── controllers/     
│   │   │   ├── middlewares/   
│   │   │   ├── routes/          
│   │   │   ├── services/      
│   │   │   └── utils/
│   │   │
│   │   ├── problem-service/   
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── core/          
│   │   │
│   │   ├── submission-service/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── kafka/           
│   │   │   └── utils/
│   │   │
│   │   ├── container-service/ 
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   │
│   │   ├── database/            
│   │   │   ├── schema.ts      
│   │   │   ├── connector.ts
│   │   │   └── drizzle.ts
│   │   │
│   │   ├── configs/           
│   │   │   ├── clerk.config.ts
│   │   │   ├── logger.config.ts
│   │   │   ├── minio.config.ts
│   │   │   └── dotenv.config.ts
│   │   │
│   │   ├── utils/             
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── .gitignore
│   │   ├── tsconfig.json
│   │   ├── .env
│   │   └── app.ts             
│   │
│   └── notebook_worker/         
│       ├── app.py
│       ├── Dockerfile
│       ├── requirements.txt
├───────└── object_store.py                   
```

---

### Infrastructure Components
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Caching**: Redis for high-performance data caching
- **Message Queue**: Apache Kafka for asynchronous event processing
- **Object Storage**: MinIO S3-compatible storage for files
- **Orchestration**: Kubernetes for container management and scaling

### Python Worker
- [MLCode Notebook Docker Image](https://hub.docker.com/r/paraspunjabi2002/mlcode_notebook) - Python environment for code execution

---

## 🔧 Services Overview

### API Gateway Service
- **Purpose**: HTTP entry point, request routing, authentication
- **Key Features**:
  - Clerk JWT validation
  - HTTP proxy to other services
  - Error handling middleware
  - Request logging

### Problem Service
- **Purpose**: Problem CRUD operations and caching
- **Key Features**:
  - Redis-based caching
  - Database queries via Drizzle
  - Problem retrieval optimization

### Submission Service
- **Purpose**: Handle code submissions and process results
- **Key Features**:
  - Kafka producer for submission events
  - Result validation
  - Submission history tracking

### Container Service
- **Purpose**: Dynamically provision Jupyter Notebook pods for user code execution
- **Key Features**:
  - Kubernetes manifest generation
  - Container lifecycle management
  - Resource allocation
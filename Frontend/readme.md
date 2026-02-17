# Full-Stack Production Deployment 🚀

A robust, containerized architecture featuring a React frontend, Node.js backend, and PostgreSQL database, managed by Nginx and deployed via GitHub Actions.

## 🏗 System Architecture

The following diagram illustrates how users interact with the system and how the CI/CD pipeline handles updates.

```mermaid
graph TD
    User((User Browser)) -->|HTTPS:443| Nginx[Nginx Container]
    
    subgraph "Docker Internal Network"
        Nginx -->|Serves Static Files| Frontend[Frontend Assets /dist]
        Nginx -->|Proxy Pass /api| Backend[Node.js API]
        Backend -->|Internal Query| DB[(PostgreSQL)]
    end

    subgraph "GitHub Actions CI/CD"
        Git[Push to Main] --> Build[Build React dist]
        Build --> SCP[SCP: Transfer Files]
        SCP --> SSH[SSH: docker-compose up]
    end

    SSH -.-> |Restarts| Nginx
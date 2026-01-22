# SkillPath AI - Backend

This directory contains the Spring Boot backend for the SkillPath AI application. It provides a RESTful API for user authentication, profile management, roadmap storage, and real-time communication via WebSockets.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Java 17+**: The project is built with Java 17. You can use a JDK distribution like OpenJDK or Amazon Corretto.
- **Maven**: Used for building the project and managing dependencies.
- **Docker & Docker Compose**: Used to easily run the required PostgreSQL database in an isolated container.

## Setup & Running

Follow these steps to get the backend server up and running on your local machine.

### 1. Start the Database

The project uses a PostgreSQL database, which can be started easily using the `docker-compose.yml` file located in the project's root directory.

From the **root directory** of the project (not the `backend` directory), run:

```bash
docker-compose up -d
```
- This command starts a PostgreSQL container in the background.
- It creates a database named `skillpath_db` with the username `postgres` and password `password`, as configured in `application.properties`.
- The database will be accessible on your local machine at port `5432`.

### 2. Run the Backend Server

Once the database is running, you can start the Spring Boot application.

1.  Navigate to this directory in your terminal:
    ```bash
    cd backend
    ```
2.  Use Maven to compile the code and run the application:
    ```bash
    mvn spring-boot:run
    ```
3.  The server will start up and connect to the database. You will see log output in your terminal. Once it's ready, it will be listening on `http://localhost:8080`.

### Development Admin User

On the first run, the application automatically creates a default administrator account for development and testing purposes:

-   **Email:** `admin@skillpath.com`
-   **Password:** `admin123`

You can use these credentials or click the "Dev Login (Admin)" button on the frontend to sign in.

## API Architecture

- **Authentication**: Secured using Spring Security with JSON Web Tokens (JWT).
- **Database**: Interacts with the PostgreSQL database via Spring Data JPA.
- **Controllers**:
    - `AuthController`: Handles user registration, login, logout, and password management.
    - `UserController`: Manages user profile updates and learning roadmap data.
- **WebSockets**:
    - `WebSocketConfig`: Configures STOMP for real-time messaging.
    - `UserMetricsService`: Pushes live updates (like XP gain) to the connected client.

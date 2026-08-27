# Sarinventory Backend

Sarinventory Backend is a backend service for the Sarinventory web application. It provides APIs for managing user authentication, inventory, transactions, customer credit, and business metrics. 

## Technologies Used
- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine, used to run the backend server.
- Express.js: A web application framework for Node.js, used to build the backend APIs.
- TypeScript: A statically typed superset of JavaScript, used for type safety and better code maintainability.
- Prisma: An ORM (Object-Relational Mapping) tool for database management, used to interact with the database.
- zod: A library for schema validation, used to validate incoming request data.
- jsonwebtoken: A library for generating and verifying JSON Web Tokens (JWT) for user authentication.
- cookie-parser: A library for parsing cookies in HTTP requests.
- bcrypt: A library for hashing passwords, used for secure password storage.
- cors: A library for enabling Cross-Origin Resource Sharing (CORS) in the backend APIs.
- express-rate-limit: A library for rate limiting incoming requests to prevent abuse and ensure fair usage of the APIs.
- helmet: A library for securing HTTP headers, used to enhance the security of the backend APIs.
- ua-parser-js: A library for parsing user-agent strings, used to identify the client's device and browser information.

## Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- PostgreSQL (or any other supported database)
- Postman (optional, for testing APIs)
- Git (for version control)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/johnreycanencia/sarinventory-backend.git
    ```
2. Navigate to the project directory:
   ```bash 
    cd sarinventory-backend
     ```
3. Install the dependencies:
   ```bash
    npm install
     ```    
4. Set up the environment variables by creating a `.env` file in the root directory and adding the following variables:
   ```
   DATABASE_URL=your_database_url
   DIRECT_URL=your_database_direct_url
   JWT_ACCESS_SECRET=your_jwt_secret
   ALLOWED_ORIGINS=your_allowed_origins
   NODE_ENV=development
   PORT=your_port_number
   ```

5. Run the database migrations using Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```
   then
   ```bash
   npx prisma generate
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

## Internal Documentation
For detailed internal documentation, please refer to the following files in the `docs` directory:
- `api.md`: Contains information about the available APIs, their endpoints, request/response formats.
- `database.md`: Contains information about the database schema, tables, and relationships.
- `authentication.md`: Contains information about the authentication flow, JWT usage, and security considerations.
- `error.md`: Contains information about error handling, error codes, and error response formats.
- `architecture.md`: Contains information about the overall architecture of the backend service, including the folder structure, modules, and components.
- `security.md`: Contains information about security best practices, including password hashing, token expiration, and secure cookie handling.
- `deployment.md`: Contains information about deploying the backend service on various platforms, including Render and Supabase.
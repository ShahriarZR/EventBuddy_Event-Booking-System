# Event Buddy Backend API

This is the backend API for the Event Buddy application, built with [NestJS](https://nestjs.com/). It provides RESTful endpoints for user, admin, authentication, and event management functionalities.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) database

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend/project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your database connection and other environment variables.

   > Note: This project uses [TypeORM](https://typeorm.io/) for database interactions. Please create a `.env` file in the root directory and set the necessary environment variables such as database host, port, username, password, and database name. Example:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   ```

4. Run database migrations or synchronize your database schema as per your TypeORM configuration.

## Running the Application

- Start the application in development mode with hot reload:

  ```bash
  npm run start:dev
  ```

- Start the application in production mode:

  ```bash
  npm run start:prod
  ```

- Build the application:

  ```bash
  npm run build
  ```

- Start the application normally:

  ```bash
  npm run start
  ```

The server will start on [http://localhost:3000](http://localhost:3000).

## API Documentation

Swagger API documentation is available at:

```
http://localhost:3000/api-docs
```

## Static Files

Uploaded files are served statically from the `/uploads` path. For example:

```
http://localhost:3000/uploads/your-file.png
```

### Adding Admin Users Manually

To add admin users manually, you can either:

1. Directly update the user role in the database to `admin` for the desired user record.

2. Modify the `saveNewUser` function in `src/user/user.service.ts` to set `data.role = 'admin'` before saving a new user. This will create a new user with admin privileges.

Make sure to revert any code changes after creating admin users if you choose the second method.

## Testing

- Run unit tests:

  ```bash
  npm run test
  ```

- Run tests in watch mode:

  ```bash
  npm run test:watch
  ```

- Run end-to-end tests:

  ```bash
  npm run test:e2e
  ```

- Generate test coverage report:

  ```bash
  npm run test:cov
  ```

## Linting and Formatting

- Run ESLint to check and fix linting issues:

  ```bash
  npm run lint
  ```

- Format code using Prettier:

  ```bash
  npm run format
  ```

## Project Structure

- `src/` - Source code directory
  - `auth/` - Authentication module
  - `admin/` - Admin module
  - `user/` - User module
  - `home/` - Home module
  - `entity/` - Database entities
  - `uploads/` - Uploaded static files
  - `main.ts` - Application entry point
  - `app.module.ts` - Root module

## Notes

- Ensure your PostgreSQL database is running and accessible with the credentials provided in your `.env` file.
- The application uses JWT for authentication.
- Roles and permissions are enforced globally via guards.

---

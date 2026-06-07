# Data Engineering Activity

This project is a web application built with **Next.js**, integrated with a
custom server using **Socket.io** for real-time communication and
**Drizzle ORM** for data persistence in a **PostgreSQL** database.

## 🚀 Technologies

- **Framework:** Next.js (v16)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Real-time Communication:** Socket.io
- **Package Manager:** Bun
- **Styling:** Tailwind CSS v4

## 📦 Project Structure

- `src/app`: Next.js routes and components.
- `src/db`: Database configuration and schemas.
- `src/server.ts`: Custom server for Socket.io integration.
- `src/Components`: Shared React components.

## 🛠️ Setup and Installation

### Prerequisites

- [Bun](https://bun.sh/) installed.
- A running PostgreSQL instance.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Linksyyy/Open-Chat
   cd Open-Chat
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Configure environment variables in a `.env` file:

   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/db_name
   ```

## 🚀 Running the Project

### Development

To run the server in development mode with hot-reload:

```bash
bun dev
```

### Database

To sync the Drizzle schema with the database:

```bash
bun db:push
```

### Production

1. Build the Next.js application:

   ```bash
   bun build
   ```

2. Start the custom server in production mode:

   ```bash
   bun start
   ```

> **Note:** The custom server in `src/server.ts` correctly handles Next.js
> requests via `handle(req, res)`, allowing features like Intercepting
> Routes and Socket.io to coexist.

## 📄 License

This project is licensed under the
[GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.html).
(Note: GPL v4 has not been released yet).

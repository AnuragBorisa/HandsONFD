# Node.js Hands-On Practice Questions

1. **Todo REST API (CRUD)**  
   **Problem:** Use Express and Postgres (Knex or Prisma) to build a CRUD API for “todos” with JWT authentication, input validation, rate limiting, and OpenAPI (Swagger) documentation. Write unit and integration tests (Jest + Supertest) to achieve ≥ 95% coverage.

2. **Stream CSV Transformer**  
   **Problem:** Read a multi-gigabyte CSV file as a stream, transform each row (e.g., filter, map fields), and upload the output to S3—all without loading the entire file into memory. Use Node’s `stream.pipeline` and handle back-pressure correctly.

3. **Redis Rate Limiter**  
   **Problem:** Implement Express middleware that limits requests per IP using Redis and a sliding-window algorithm. Return `Retry-After` headers and compare performance vs. a token-bucket approach.

4. **WebSocket Chat Server**  
   **Problem:** Build a real-time chat server with the `ws` library. Require a valid JWT handshake, support rooms (channels), broadcast pings/pongs for liveness, and load-test with Artillery.

5. **Image Resizer Worker Pool**  
   **Problem:** Create a service that accepts image upload requests and resizes them to multiple dimensions using a worker pool (`worker_threads` or BullMQ). Use Sharp for resizing, manage graceful shutdown on SIGTERM, and report metrics.

6. **Project Scaffolder CLI**  
   **Problem:** Build a CLI tool (`npm init myapp`) that scaffolds a project from templates. Support user prompts, colorized output, and an “update available” notifier. Package it as an npm “create-” command.

7. **Structured Logging**  
   **Problem:** Integrate Winston (or Pino) and Morgan to emit JSON logs with request IDs. Rotate log files daily, ship to Elasticsearch (or a file), and correlate logs across async calls via continuation-local storage.

8. **Secure Password Reset Flow**  
   **Problem:** Implement a password-reset endpoint: generate time-bound tokens (crypto.randomUUID), email them via a mailer, hash tokens in the DB, and mitigate replay attacks. Include unit tests for token expiry and replay.

9. **Full Test & CI Pipeline**  
   **Problem:** Write comprehensive unit and integration tests for an Express app (Jest + Supertest). Configure a GitHub Actions workflow to run linting, tests, and build on push, and publish coverage reports.

10. **Dockerized Microservice**  
    **Problem:** Containerize a Node.js REST service in a multi-stage Docker build, run it as a non-root user, add a health-check endpoint, handle SIGTERM for graceful shutdown, and prepare a Kubernetes readiness probe.

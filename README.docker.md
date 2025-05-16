# Trip Expense Calculator - Docker Guide

This document explains how to build and run the Trip Expense Calculator application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository, if you haven't already)

## Building and Running with Docker

### Using Docker Compose (Recommended)

1. Build and start the application:
   ```bash
   docker-compose up -d
   ```

2. Access the application in your browser at:
   ```
   http://localhost:3000
   ```

3. To stop the application:
   ```bash
   docker-compose down
   ```

### Using Docker Directly

1. Build the Docker image:
   ```bash
   docker build -t trip-expense-calculator .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 trip-expense-calculator
   ```

3. Access the application in your browser at:
   ```
   http://localhost:3000
   ```

## Development with Docker

For development purposes, you can mount your local directory to see changes in real-time:

```bash
docker run -p 3000:3000 -v $(pwd):/app trip-expense-calculator npm run dev
```

## Troubleshooting

- If you encounter permission issues, make sure Docker has the necessary permissions on your system.
- For any application-specific issues, check the container logs:
  ```bash
  docker-compose logs
  # or
  docker logs [container-id]
  ``` 
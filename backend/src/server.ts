import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import {
  checkDatabaseConnection,
  pool
} from './config/database.js';

import {
  errorMiddleware
} from './middleware/error.middleware.js';

import authRoutes from './modules/auth/routes/auth.routes.js';

const app = express();

const port = Number(process.env.PORT ?? 3000);

// ========================================
// 1. VALIDATION DU PORT
// ========================================

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

// ========================================
// 2. CORS CONFIGURATION
// ========================================

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:4200'
}));

// ========================================
// 3. GLOBAL MIDDLEWARES
// ========================================

app.use(express.json({ limit: '10kb' }));

// ========================================
// 4. HEALTH CHECK
// ========================================

app.get('/health', async (_request, response) => {
  try {
    await checkDatabaseConnection();

    response.status(200).json({
      status: 'ok',
      database: 'connected'
    });

  } catch (error) {
    console.error('Health check failed:', error);

    response.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

// ========================================
// 5. AUTHENTICATION ROUTES
// ========================================

app.use('/api/auth', authRoutes);

// ========================================
// 6. ROUTE 404
// ========================================

app.use((_request, response) => {
  response.status(404).json({
    error: 'Not found'
  });
});

// ========================================
// 7. ERROR HANDLING
// ========================================

app.use(errorMiddleware);

// ========================================
// 8. HTTP SERVER
// ========================================

let server: ReturnType<typeof app.listen> | undefined;

async function startServer(): Promise<void> {

  // Vérifier PostgreSQL avant le démarrage HTTP
  await checkDatabaseConnection();

  console.info('PostgreSQL connected successfully.');

  // Démarrer Express
  server = app.listen(port, () => {
    console.info(`Backend listening on port ${port}.`);
  });

}

// ========================================
// 9. GRACEFUL SHUTDOWN
// ========================================

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals): Promise<void> {

  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.info(`Received ${signal}; shutting down.`);

  try {

    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    await pool.end();

    console.info('Server and database connections closed.');

  } catch (error) {

    console.error('Shutdown error:', error);

    process.exitCode = 1;
  }
}

// ========================================
// 10. PROCESS SIGNALS
// ========================================

process.once('SIGINT', () => {
  void shutdown('SIGINT');
});

process.once('SIGTERM', () => {
  void shutdown('SIGTERM');
});

// ========================================
// 11. START APPLICATION
// ========================================

void startServer().catch(async (error: unknown) => {

  console.error('Failed to start backend:', error);

  await pool.end().catch((poolError: unknown) => {
    console.error('Failed to close PostgreSQL pool:', poolError);
  });

  process.exitCode = 1;

});
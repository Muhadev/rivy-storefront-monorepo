import { Request, Response } from 'express';
import { connectDb } from '../db';
import { log } from '../middlewares/logging';
import os from 'os';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    memory: 'healthy' | 'unhealthy';
  };
  system: {
    memory: {
      used: string;
      total: string;
      percentage: string;
    };
    cpu: {
      cores: number;
      load: number[];
    };
  };
}

class HealthController {
  static async healthCheck(req: Request, res: Response) {
    const startTime = Date.now();
    
    try {
      // Check database connectivity
      const dbStatus = await HealthController.checkDatabase();
      
      // Check memory usage
      const memoryInfo = HealthController.getMemoryInfo();
      const memoryPercentage = parseFloat(memoryInfo.percentage.replace('%', ''));
      // More lenient memory threshold for development (95% instead of 90%)
      const memoryThreshold = process.env.NODE_ENV === 'development' ? 95 : 90;
      const memoryStatus = memoryPercentage < memoryThreshold ? 'healthy' : 'unhealthy';
      
      // Overall health status
      const isHealthy = dbStatus === 'healthy' && memoryStatus === 'healthy';
      
      const healthStatus: HealthStatus = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        services: {
          database: dbStatus,
          memory: memoryStatus
        },
        system: {
          memory: memoryInfo,
          cpu: {
            cores: os.cpus().length,
            load: os.loadavg()
          }
        }
      };

      const responseTime = Date.now() - startTime;
      
      log.info('Health check completed', {
        correlationId: req.correlationId,
        status: healthStatus.status,
        responseTime,
        dbStatus,
        memoryUsage: memoryInfo.percentage
      });

      const statusCode = isHealthy ? 200 : 503;
      res.status(statusCode).json(healthStatus);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      log.error('Health check failed', {
        correlationId: req.correlationId,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      });

      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  }

  static async readinessCheck(req: Request, res: Response) {
    try {
      // More strict checks for readiness
      const dbStatus = await HealthController.checkDatabase();
      
      if (dbStatus === 'healthy') {
        log.info('Readiness check passed', { correlationId: req.correlationId });
        res.status(200).json({
          status: 'ready',
          timestamp: new Date().toISOString()
        });
      } else {
        log.warn('Readiness check failed - database unhealthy', { 
          correlationId: req.correlationId 
        });
        res.status(503).json({
          status: 'not_ready',
          reason: 'Database not available',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      log.error('Readiness check error', {
        correlationId: req.correlationId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      res.status(503).json({
        status: 'not_ready',
        error: 'Readiness check failed',
        timestamp: new Date().toISOString()
      });
    }
  }

  static livenessCheck(req: Request, res: Response) {
    // Simple liveness check - if we can respond, we're alive
    log.debug('Liveness check', { correlationId: req.correlationId });
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  private static async checkDatabase(): Promise<'healthy' | 'unhealthy'> {
    try {
      // Test database connection with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database timeout')), 5000);
      });

      await Promise.race([
        connectDb(),
        timeoutPromise
      ]);

      return 'healthy';
    } catch (error) {
      log.error('Database health check failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return 'unhealthy';
    }
  }

  private static getMemoryInfo() {
    const used = process.memoryUsage();
    const total = os.totalmem();
    const free = os.freemem();
    const usedBytes = used.heapUsed;
    const percentage = ((total - free) / total) * 100;

    return {
      used: `${Math.round(usedBytes / 1024 / 1024)}MB`,
      total: `${Math.round(total / 1024 / 1024)}MB`,
      percentage: `${percentage.toFixed(2)}%`
    };
  }
}

export default HealthController;

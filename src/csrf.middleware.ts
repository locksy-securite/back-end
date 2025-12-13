import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Liste des origines autorisées (basé sur main.ts)
    const allowedOrigins = [
      process.env.CORS_ORIGIN, // De la config
      'http://localhost:5000',
    ].filter(Boolean); // Filtrer les undefined

    const origin = req.headers.origin as string;

    // Pour les requêtes modifiant l'état (CSRF sensibles)
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      // Si Origin est présent (requête cross-origin) et non autorisé, bloquer
      if (origin && !allowedOrigins.includes(origin)) {
        return res.status(403).json({ message: 'CSRF protection: Invalid origin' });
      }
    }

    next();
  }
}

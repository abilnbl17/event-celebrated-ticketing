import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userData?: any; // Tambahkan deklarasi properti di sini
    }
  }
}

export class ExtractUserIdFromTokenMiddleware {
  extractUserIdFromToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
      try {
        const decodedToken: any = jwt.verify(token, 'secretkey');
        req.userData = decodedToken.id;
        next();
      } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token' });
      }
    } else {
      res.status(401).json({ error: 'Token not provided' });
    }
  }
}

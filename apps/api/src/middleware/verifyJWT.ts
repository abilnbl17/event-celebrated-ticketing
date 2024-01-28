import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      dataUser: any;
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(400).send('Token not found');
    }

    // Mengambil data token dari redis dan dicocokan dengan token dari header

    console.log(token);

    if (token) {
      const verifiedToken = verify(token, 'Event123');

      req.dataUser = verifiedToken;
      next();
    } else {
      return res.status(401).send('Token is not valid');
    }
  } catch (error) {
    return res.status(400).send('Token error');
  }
};

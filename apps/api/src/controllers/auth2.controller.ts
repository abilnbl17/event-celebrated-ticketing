import prisma from '../prisma';
import { Request, Response } from 'express';

import { sign } from 'jsonwebtoken';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (!user) {
        throw new Error('INVALID Username');
      }

      const jwtToken = sign({ id: user.id, email: user.email }, 'andi123');

      return res.status(200).send({
        username: user.user_name,
        email: user.email,
        token: jwtToken,
      });
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: error.message || 'Internal Server Error' });
    }
  }
}

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetEventByIdController {
  async getEventById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      let event;
      if (id) {
        event = await prisma.event.findUnique({
          where: { id: parseInt(id, 10) },
        });
      } else {
        return res.status(400).json({ error: 'Not Found' });
      }

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

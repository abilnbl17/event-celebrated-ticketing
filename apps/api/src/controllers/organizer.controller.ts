import { Request, Response } from 'express';
import prisma from '../prisma';

export class OrganizerController {
  async organizerEvent(req: Request, res: Response) {
    try {
      let events;
      const userIdFromToken = req.userData;
      if (userIdFromToken) {
        events = await prisma.event.findMany({
          where: { organizer_id: userIdFromToken },
        });
        return res.json(events);
      }
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: error.message || 'Internal Server Error' });
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';

export class EventController {
  async eventStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const loggedUser = req.dataUser;
      const { filter_date } = req.query;

      if (filter_date == 'month') {
      }
      const events = await prisma.event.findMany({
        where: {
          organizer_id: loggedUser.id,
        },
      });
      return res.status(200).send({
        status: true,
        data: events,
        message: 'Get Data Success',
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: error.message,
      });
    }
  }
}

import { Request, Response } from 'express';
import prisma from '../prisma';

export class TicketController {
  async ticketFilter(req: Request, res: Response) {
    const { filter, page } = req.query as {
      filter?: string;
      page?: string;
    };

    const now = new Date();
    const pageSize = 6;

    try {
      const pageNumber = parseInt(page || '1');
      const skip = (pageNumber - 1) * pageSize;

      const userIdFromToken = req.dataUser;

      let events;

      if (filter === 'Upcoming') {
        events = await prisma.event.findMany({
          where: {
            end_time: {
              gt: now,
            },
            transactions: {
              some: {
                user_id: userIdFromToken, // Filter transaksi berdasarkan ID pengguna
              },
            },
          },
          skip,
          take: pageSize,
        });
      } else if (filter === 'History') {
        events = await prisma.event.findMany({
          where: {
            end_time: {
              lt: now,
            },
            transactions: {
              some: {
                user_id: userIdFromToken, // Filter transaksi berdasarkan ID pengguna
              },
            },
          },
          skip,
          take: pageSize,
        });
      } else {
        events = await prisma.event.findMany({
          where: {
            transactions: {
              some: {
                user_id: userIdFromToken, // Filter transaksi berdasarkan ID pengguna
              },
            },
          },
          skip,
          take: pageSize,
        });
      }

      if (events.length === 0) {
        return res.status(404).json({ message: 'Ticket not found' });
      } else {
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

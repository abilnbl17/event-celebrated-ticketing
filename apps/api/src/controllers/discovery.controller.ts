import { Request, Response } from 'express';
import prisma from '../prisma';
import { Category } from '@prisma/client';

export class DiscoveryController {
  async discoverEvents(req: Request, res: Response) {
    const { category, is_free, is_online, search, start_date, end_date, page } =
      req.query as {
        category?: Category;
        is_free?: string;
        is_online?: string;
        search?: string;
        start_date?: string;
        end_date?: string;
        page?: string;
      };

    const pageSize = 6; // Jumlah item per halaman

    try {
      const localTime = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
      const localTimeISO = new Date(localTime).toISOString();
      const pageNumber = parseInt(page || '1');

      const events = await prisma.event.findMany({
        where: {
          category: category ? { equals: category } : undefined,
          is_free: is_free ? { equals: is_free === 'true' } : undefined,
          is_online: is_online ? { equals: is_online === 'true' } : undefined,
          title: search ? { contains: search } : undefined,
          date_time: {
            gte: start_date
              ? new Date(
                  new Date(start_date).toLocaleString('en-US', {
                    timeZone: 'UTC',
                  }),
                ).toISOString()
              : undefined,
            lte: end_date
              ? new Date(
                  new Date(end_date).toLocaleString('en-US', {
                    timeZone: 'UTC',
                  }),
                ).toISOString()
              : undefined,
          },
          end_time: {
            gte: localTimeISO,
          },
        },
        orderBy: { date_time: 'asc' },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      if (events.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      } else {
        return res.status(200).json(events);
      }
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: error.message || 'Internal Server Error' });
    }
  }
}

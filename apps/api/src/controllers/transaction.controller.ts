import prisma from '../prisma';
import { Request, Response, Router } from 'express';

export class TransactionController {
  async checkout(req: Request, res: Response) {
    try {
      const userId = req.userData;
      const { couponId, pointUsed } = req.body;
      const { eventId } = req.params;

      const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) },
      });

      if (!event) {
        return res.status(404).json({ error: 'Event tidak ditemukan' });
      }

      if (event.seats <= 0) {
        return res.status(400).json({ error: 'Event sudah habis kursinya' });
      }

      // Lakukan validasi user
      const user = await prisma.user.findUnique({
        where: { id: req.userData },
      });

      if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      // Ambil harga event
      let totalPrice: number = event.price.toNumber();

      if (couponId) {
        const coupon = await prisma.coupons.findUnique({
          where: {
            id: parseInt(couponId),
          },
        });

        if (coupon) {
          const couponAmount: number = coupon.discount_amount.toNumber() ?? 0;
          totalPrice -= couponAmount;

          // Kurangi usage_limit kupon
          await prisma.coupons.update({
            where: { id: parseInt(couponId) },
            data: {
              usage_limit: coupon.usage_limit - 1,
              is_used: coupon.usage_limit - 1 === 0, // Set is_used menjadi true jika usage_limit mencapai 0
            },
          });
        }
      }

      if (pointUsed) {
        try {
          const totalPoints = await prisma.referralPoint.aggregate({
            where: { referrer_id: userId },
            _sum: { points: true },
          });

          const points = Number(totalPoints._sum?.points) || 0;

          if (points > totalPrice) {
            // Menghitung sisa poin setelah menggunakan totalPrice
            let remainingPoints = points - totalPrice;

            // Mengurangi nilai totalPrice menjadi 0
            totalPrice = 0;

            // Lakukan pengurangan poin dari referralPoint
            const referralPointsToUpdate = await prisma.referralPoint.findMany({
              where: {
                referrer_id: userId,
                claim_points: false,
              },
              orderBy: {
                id: 'asc',
              },
            });

            for (const point of referralPointsToUpdate) {
              if (remainingPoints >= point.points) {
                // Jika sisa poin cukup untuk mengurangi point ini, update dan lanjut ke point berikutnya
                await prisma.referralPoint.update({
                  where: { id: point.id },
                  data: { claim_points: true, points: 0 },
                });
                remainingPoints -= point.points;
              } else {
                // Jika sisa poin tidak cukup untuk mengurangi point ini, update dan selesai
                await prisma.referralPoint.update({
                  where: { id: point.id },
                  data: { points: point.points - remainingPoints },
                });
                break;
              }
            }
          } else {
            // Jika points tidak cukup untuk mengcover totalPrice, kurangkan totalPrice
            totalPrice -= points;
            // Lakukan pengurangan poin dari referralPoint
            const referralPointsToUpdate = await prisma.referralPoint.findMany({
              where: {
                referrer_id: userId,
                claim_points: false,
              },
            });

            for (const point of referralPointsToUpdate) {
              await prisma.referralPoint.update({
                where: { id: point.id },
                data: { claim_points: true, points: 0 },
              });
            }
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      const transaction = await prisma.transaction.create({
        data: {
          user_id: userId,
          event_id: parseInt(eventId),
          coupon_event_id: couponId ? parseInt(couponId) : null,
          points_used: pointUsed ? parseInt(pointUsed) : 0,
          totalamount: totalPrice,
        },
      });

      // Update jumlah kursi yang tersedia di event
      await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: { seats: event.seats - 1 },
      });

      res.status(201).json({ transaction });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  async dataCheckout(req: Request, res: Response) {
    try {
      const eventId = parseInt(req.params.eventId);
      const userIdFromToken = req.userData;

      // Mengambil harga dari tabel Event
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { price: true, title: true },
      });

      // Mengambil daftar kupon terkait dari tabel Coupon
      const coupons = await prisma.coupons.findMany({
        where: { event_id: eventId },
      });

      // Mengambil poin terkait dari tabel ReferralPoint

      const totalPointsResult = await prisma.referralPoint.aggregate({
        where: {
          referrer_id: userIdFromToken,
        },
        _sum: { points: true },
      });

      const totalPoints = totalPointsResult?._sum?.points || 0;

      const result = {
        eventPrice: event?.price || 0,
        eventCoupons: coupons,
        userPoints: totalPoints || 0,
        titleEvent: event?.title,
      };

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching checkout information:', error.message);
      throw error;
    }
  }
}

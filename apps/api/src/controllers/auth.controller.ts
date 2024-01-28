import { Request, Response, NextFunction, response } from 'express';
import prisma from '@/prisma';
import { compare, genSalt, hash } from 'bcrypt';
import jwt, { sign } from 'jsonwebtoken';
import { Role } from '@prisma/client';
// import { redisClient } from 'helpers/redis';
// import { hash } from 'bcrypt';

export class AuthController {
  // Register User
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const user_name = req.body.user_name;
      console.log(email, user_name); // testing

      // referral code use anagram
      function generateReferralCode(
        email: string,
        username: string,
        length: number,
      ) {
        const combinedString = email + username;

        // random character
        const shuffledString = combinedString
          .split('')
          .sort(() => Math.random() - 0.5)
          .join('')
          .substring(0, length);

        return shuffledString;
      }

      const referralCode = generateReferralCode(email, user_name, 8);

      const existingUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      if (existingUser) {
        throw new Error('Email is already exist');
      }

      const salt = await genSalt(10);
      // hashpassword for random password at develop or database
      const hashPassword = await hash(req.body.password, salt);

      // existing referral
      if (req.body.referral) {
        const existingReferral = await prisma.user.findFirst({
          where: { referral_code: req.body.referral },
        });
        if (!existingReferral) {
          throw new Error('referral is invalid');
        }
      }

      // add new user
      const newUser = await prisma.user.create({
        data: {
          user_name: req.body.user_name,
          email: req.body.email,
          password: hashPassword,
          referral_code: referralCode,
          role: req.body.role,
        },
      });
      const now = new Date();
      const expirationDate = new Date(now);
      expirationDate.setDate(now.getDate() + 90);

      if (req.body.referral) {
        const existingReferral = await prisma.user.findFirst({
          where: { referral_code: req.body.referral },
        });
        if (existingReferral) {
          await prisma.referralPoint.create({
            data: {
              referrer_id: existingReferral.id,
              expiration_date: expirationDate,
            },
          });
        }
      }
      if (req.body.referral) {
        const existingReferred = await prisma.user.findUnique({
          where: { id: newUser.id },
        });
        if (existingReferred) {
          await prisma.coupons.create({
            data: {
              user_id: newUser.id,
              name: 'coupon referral',
              usage_limit: 1,
              expiration_date: expirationDate,
              discount_amount: 10,
            },
          });
        }
      }

      return res.status(201).send({ success: true, result: newUser });
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  }

  // Login User
  async loginUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.body.email },
      });

      // generate Token
      const jwtToken = sign(
        { id: user.id, role: user.role, email: user.email },
        'Event123',
      );

      //func compare () from bcrypt
      const isValidPassword = await compare(req.body.password, user.password);
      // if (isvalidpassword == false, throw error)
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      return res.status(200).send({
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        token: jwtToken,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: error.message,
      });
    }
  }

  //   async logoutUser(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       await redisClient.del(`check:${req.body.email}`);
  //       return res.status(200).send({
  //         status: true,
  //         message: 'logout Success',
  //       });
  //     } catch (error: any) {
  //       res.status(500).send({
  //         status: false,
  //         message: error.message,
  //       });
  //     }
  //   }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dataUser = req.dataUser;
      const existingUser = await prisma.user.findFirstOrThrow({
        where: { email: dataUser.email },
      });
      const salt = await genSalt(10);
      const hashPassword = await hash(req.body.password, salt);
      await prisma.user.update({
        where: { email: existingUser.email },
        data: { password: hashPassword },
      });
      return res.send({
        status: true,
        message: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

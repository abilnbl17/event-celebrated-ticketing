import { registerValidation } from '../middleware/validator';
import { Router } from 'express';
import { verifyToken } from '@/middleware/verifyJWT';
import { EventController } from '@/controllers/event.controller';

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, this.eventController.eventStatistic);
  }

  getRouter(): Router {
    return this.router;
  }
}

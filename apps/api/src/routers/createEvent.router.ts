import { ExtractUserIdFromTokenMiddleware } from '../middleware/jwt';
import { CreateEventController } from '../controllers/createEvent.controller';
import { Router } from 'express';
import { uploader } from '../middleware/uploader';

export class CreateEventRouter {
  private router: Router;
  private createEventController: CreateEventController;
  private extractUserIdMiddleware: ExtractUserIdFromTokenMiddleware;

  constructor() {
    this.createEventController = new CreateEventController();
    this.extractUserIdMiddleware = new ExtractUserIdFromTokenMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      uploader('IMG', '/image').single('image'),
      this.extractUserIdMiddleware.extractUserIdFromToken,
      this.createEventController.createEvent,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

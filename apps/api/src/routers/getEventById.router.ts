import { GetEventByIdController } from '../controllers/getEventById.controller';
import { Router } from 'express';

export class GetEventByIdRouter {
  private router: Router;
  private getEventByIdController: GetEventByIdController;

  constructor() {
    this.getEventByIdController = new GetEventByIdController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/:id', this.getEventByIdController.getEventById);
  }

  getRouter(): Router {
    return this.router;
  }
}

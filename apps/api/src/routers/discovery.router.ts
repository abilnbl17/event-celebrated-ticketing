import { DiscoveryController } from '../controllers/discovery.controller';
import { Router } from 'express';

export class DiscoveryRouter {
  private router: Router;
  private discoveryController: DiscoveryController;

  constructor() {
    this.discoveryController = new DiscoveryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.discoveryController.discoverEvents);
  }

  getRouter(): Router {
    return this.router;
  }
}

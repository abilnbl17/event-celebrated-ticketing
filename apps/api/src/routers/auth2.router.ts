import { AuthController } from '../controllers/auth2.controller';
import { Router } from 'express';

export class AuthRouter2 {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.authController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}

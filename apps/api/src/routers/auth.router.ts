import { AuthController } from '@/controllers/auth.controller';
import { registerValidation } from '../middleware/validator';
import { Router } from 'express';
import { verifyToken } from '@/middleware/verifyJWT';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  //when used, it can be executed
  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/register',
      registerValidation,
      this.authController.registerUser,
    );
    this.router.post('/login', this.authController.loginUser);
    this.router.post('/reset', verifyToken, this.authController.resetPassword);
    // this.router.post('/logout', verifyToken, this.authController.logoutUser);
  }

  getRouter(): Router {
    return this.router;
  }
}

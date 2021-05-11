import { Application } from 'express';
import paycheckRouter from './api/controllers/router';
export default function routes(app: Application): void {
  app.use('/', paycheckRouter);
}

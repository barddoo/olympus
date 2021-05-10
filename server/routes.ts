import { Application } from 'express';
import examplesRouter from './api/controllers/router';
export default function routes(app: Application): void {
  app.use('/', examplesRouter);
}

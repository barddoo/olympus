import { Request, Response } from 'express';

export class StatusController {
  status(_: Request, res: Response): void {
    res.json({ status: 'ok' });
  }
}

import { Request, Response } from 'express';
import { PayCheckService } from '../../repository/PayCheckService';

export class PayCheckController {
  private paycheckService: PayCheckService = new PayCheckService();

  // constructor() {
  //   this.paycheckService = new PayCheckService();
  // }

  all(req: Request, res: Response): void {
    const page = (req.query['page'] as string) ?? '10';
    const data = new PayCheckService().getAll(parseInt(page));
    data.then((value) => {
      res.send(value).status(200);
    });
  }
}

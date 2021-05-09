import Datastore from 'nedb';
import Env from '../../common/env';
import { PayCheck } from '../../interface/PayCheck';
import { PayCheckResponse } from '../../interface/response/PayCheckResponse';

export class PayCheckService {
  private db: Datastore;
  private pageSize: number;
  private count: number;

  constructor() {
    this.pageSize = Env.server.controller.paycheck.defaultSize;
    this.db = new Datastore({ filename: Env.database.file, autoload: true });
    this.db.count({}, (_, n) => (this.count = n));
  }

  async getAll(skip = 1): Promise<PayCheckResponse> {
    return new Promise((resolve, reject) => {
      this.db
        .find<PayCheck>({})
        .skip(skip)
        .limit(this.pageSize)
        .exec((err, documents) => {
          if (err) reject(err);
          resolve(documents);
        });
    }).then((values) => {
      return {
        count: this.count,
        next: `${skip + 1}`,
        previous: `${skip - 1}`,
        results: values as PayCheck[],
      };
    });
  }
}

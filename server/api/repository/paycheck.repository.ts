import Datastore from 'nedb';
import Env from '../../common/env';
import { PayCheck } from '../../interface/PayCheck';
import Nedb from 'nedb';

export class PaycheckRepository {
  private _db: Nedb<PayCheck>;
  private pageSize: number;
  private _count: number;

  constructor() {
    this.pageSize = Env.server.controller.paycheck.defaultSize;
    this._db = new Datastore({ filename: Env.database.file, autoload: true });
  }

  find(skip = 10, query: unknown = {}): Promise<PayCheck[]> {
    return new Promise((resolve, reject) => {
      this._db
        .find(query)
        .skip(skip)
        .limit(this.pageSize)
        .exec((err, documents) => {
          if (err) reject(err);
          resolve(documents);
        });
    });
  }

  public async count(): Promise<number> {
    if (!this._count)
      await new Promise((resolve, reject) =>
        this._db.count({}, (err, value) => {
          if (err) reject(err);
          resolve(value);
        })
      ).then((value) => (this._count = value as number));
    return this._count;
  }
}

import Env from '../common/env';
import { PayCheck } from '../interface/PayCheck';
import { Collection, FilterQuery, MongoClient } from 'mongodb';

export class PaycheckRepository {
  private _db: Collection<PayCheck>;
  private pageSize: number;
  private _client: MongoClient;

  constructor() {
    this.pageSize = Env.server.controller.paycheck.defaultSize;
  }

  async init(): Promise<void> {
    this._client = new MongoClient(
      `mongodb+srv://${Env.database.mongo.host}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth: {
          user: Env.database.mongo.user,
          password: Env.database.mongo.pass,
        },
      }
    );
    this._db = await this._client.connect().then((conn) => {
      console.log('Connect to database');
      return conn.db(Env.database.paycheck.database).collection(Env.database.paycheck.collection);
    });
  }

  public get client(): MongoClient {
    return this._client;
  }

  find(skip = 10, query: FilterQuery<PayCheck> = {}): Promise<PayCheck[]> {
    return this._db.find(query).skip(skip).limit(this.pageSize).toArray();
  }

  findRandom(): Promise<PayCheck | null> {
    return this._db
      .aggregate([{ $match: { remuneracao_bruta: { $gte: 20000 } } }, { $sample: { size: 1 } }])
      .next();
  }

  public async count(): Promise<number> {
    return this._db.countDocuments();
  }
}

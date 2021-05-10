import { PayCheckResponse } from '../../interface/response/PayCheckResponse';
import { PaycheckRepository } from '../repository/paycheck.repository';

export class PayCheckService {
  private repository: PaycheckRepository;

  constructor() {
    this.repository = new PaycheckRepository();
  }

  async getAll(skip: number): Promise<PayCheckResponse> {
    return this.repository.find(skip).then(async (values) => {
      return {
        count: await this.repository.count(),
        next: `${skip + 1}`,
        previous: `${skip - 1}`,
        results: values,
      };
    });
  }
}

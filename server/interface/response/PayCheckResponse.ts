import { PayCheck } from '../PayCheck';

export interface PayCheckResponse {
  count: number;
  next?: string;
  previous?: string;
  results: PayCheck[];
}

import express from 'express';

import { PayCheckController } from './paycheck/PayCheck.controller';
import { StatusController } from './Status.controller';

const controller = new PayCheckController();
const statusController = new StatusController();
export default express
  .Router()
  .get('/api/v1', controller.all)
  .get('/status', statusController.status);

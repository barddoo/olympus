import express from 'express';

import { PayCheckController } from './paycheck/PayCheck.controller';

const controller = new PayCheckController();
export default express.Router().get('/api/v1', controller.all);

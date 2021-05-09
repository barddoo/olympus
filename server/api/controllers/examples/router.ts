import express from 'express';

import { PayCheckController } from './PayCheck.controller';

const controller = new PayCheckController();
export default express.Router().get('/', controller.all);

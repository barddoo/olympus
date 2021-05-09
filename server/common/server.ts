import express, { Application } from 'express';

import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import l from './logger';
import rateLimit from 'express-rate-limit';

import installValidator from './swagger';

const app = express();

export default class ExpressServer {
  private routes: (app: Application) => void;
  constructor() {
    app.use(express.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      express.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(express.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 1_000, // start blocking after 5 requests
        message:
          'Too many accounts created from this IP, please try again after an hour',
      })
    );
    app.use(cookieParser(process.env.SESSION_SECRET));
  }

  router(routes: (app: Application) => void): ExpressServer {
    this.routes = routes;
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    installValidator(app, this.routes)
      .then(() => {
        http.createServer(app).listen(port, welcome(port));
      })
      .catch((e) => {
        l.error(e);
        process.exit(1);
      });

    return app;
  }
}

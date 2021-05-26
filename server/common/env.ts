import dotenv from 'dotenv';

const env = process.env;
dotenv.config();

export default Object.freeze({
  database: {
    paycheck: {
      database: 'olympus',
      collection: 'paycheck',
    },
    mongo: {
      host: env['MONGO_HOST'] as string,
      user: env['MONGO_USER'] as string,
      pass: env['MONGO_PASS'] as string,
    },
  },
  server: {
    controller: {
      paycheck: {
        defaultSize: 10,
      },
    },
  },
  twitter: {
    apiKey: env['TWITTER_API_KEY'] as string,
    apiSecret: env['TWITTER_API_SECRET'] as string,
    bearerToken: env['TWITTER_BEARER_TOKEN'] as string,
    accessToken: env['Access_Token'] as string,
    accessTokenSecret: env['Access_Token_Secret'] as string,
  },
});

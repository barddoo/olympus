import dotenv from 'dotenv';

const env = process.env;
dotenv.config();

export default Object.freeze({
  database: { file: env['DATABASE_FILE'] },
  server: {
    controller: {
      paycheck: {
        defaultSize: 10,
      },
    },
  },
});

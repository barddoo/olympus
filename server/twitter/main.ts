/* tslint:disable */

import Twit from 'twit';
import schedule from 'node-schedule';
import _ from 'lodash';
import Env from '../common/env';

import { PaycheckRepository } from '../api/repository/paycheck.repository';

const T = new Twit({
  consumer_key: Env.twitter.apiKey,
  consumer_secret: Env.twitter.apiSecret,
  access_token: Env.twitter.accessToken,
  access_token_secret: Env.twitter.accessTokenSecret,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});
const paycheckRepository = new PaycheckRepository();
(async () => {
  await paycheckRepository.init();
  schedule.scheduleJob('0 12,19 * * *', {}, async () => {
    await tweet();
  });
})();

async function tweet() {
  const find = await paycheckRepository.findRandom();
  if (!find) throw new Error('Not found');

  const salary = parseFloat(find.total_de_rendimentos).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
  const year = find.data_referencia.getFullYear();
  const name = capitalize(find.nome);
  const tribunal = capitalize(find.tribunal);
  const cargo = capitalize(find.cargo);
  const orgao = capitalize(find.orgao);
  let message = `${name.trim()} ganhou ${salary} por mês no ano de ${year}.\nCargo: ${cargo}.\nTribunal: ${tribunal}.\nÓrgão: ${orgao}`;

  message = message.concat(`\nFonte: ${find.url}`);
  T.post('statuses/update', { status: message }, function (err: Error, result: any) {
    if (err) console.log('Error tweeting', err);
    console.log('Success, text:', result.text);
    console.log('Create at:', result.created_at);
  });
  // await paycheckRepository.client.close();
}

function capitalize(str: string): string {
  return _.startCase(_.toLower(str));
}

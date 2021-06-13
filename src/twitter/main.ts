import Twit from 'twit';
import schedule from 'node-schedule';
import _ from 'lodash';
import Env from '../common/env';

import { PaycheckRepository } from '../repository/paycheck.repository';

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
  console.log('Start');
  schedule.scheduleJob('0 11,19 * * *', async () => {
    await tweet();
  });
})();

async function tweet() {
  const find = await paycheckRepository.findRandom();
  if (!find) throw new Error('Not found');

  const salary = find.remuneracao_bruta.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
  const name = capitalize(find.nome);
  const instituicao = capitalize(find.instituicao);
  const cargo = capitalize(find.descricao_cargo);
  const superInstituicao = capitalize(find.super_instituicao);
  const setor = capitalize(find.setor_instituicao);
  let message = `${name.trim()} ganha ${salary} por mês.\nCargo: ${cargo}.\nInstituição: ${instituicao}.\nSetor: ${setor}\nÓrgão: ${superInstituicao}`;

  message = message.concat(
    `\nFonte: http://www.portaltransparencia.gov.br/servidores/${find.id_servidor}`
  );
  T.post('statuses/update', { status: message }, function (err: Error, result: any) {
    if (err) console.log('Error tweeting', err);
    console.log('Success, text:', result.text);
    console.log('Create at:', result.created_at);
  });
  await paycheckRepository.client.close();
}

function capitalize(str: string): string {
  const defaultValue = 'Sem Informação';
  return !str || str == '' ? defaultValue : str.split(' ').map(_.capitalize).join(' ');
}

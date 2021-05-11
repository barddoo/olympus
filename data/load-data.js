/* eslint-disable */

const csv = require('csvtojson');
const decompress = require('decompress');
const Datastore = require('nedb');
const db = new Datastore({ filename: 'data-db.json', autoload: true });

(async function () {
  console.log('Decompressing');

  await decompress('data/contracheque.zip', 'data');

  console.log('Start dumping');

  await csv({
    delimiter: ',',
    ignoreColumns: /cpf/,
  })
    .fromFile('data/contracheque.csv')
    .subscribe((data, index) => {
      data._id = index;
      data['data_referencia'] = data['mesano_de_referencia'];
      delete data['mesano_de_referencia'];
      return data;
    })
    .then((value) => {
      return new Promise((resolve, reject) => {
        db.insert(value, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    })
    .then(() => {
      console.log('Finish process');
    })
    .catch((err) => {
      console.log(err);
    });
})();

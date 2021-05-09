/* eslint-disable */

const csv = require('csvtojson');
const Datastore = require('nedb');
const db = new Datastore({ filename: 'data-db', autoload: true });

(async function () {
  console.log('Start dumping');
  await csv({
    delimiter: ',',
  })
    .fromFile('contracheque.csv')
    .then((value) => {
      return new Promise((resolve, reject) => {
        db.insert(value, (err, document) => {
          console.log(document.length);
          if (err) reject(err);
          resolve(document.length);
        });
      });
    })
    .then((value) => {
      console.log('Finish process, count:', value);
    })
    .catch((err) => {
      console.log(err);
    });
})();

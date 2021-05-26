/* eslint-disable */

import csv from "csvtojson";

import decompress from "decompress";

import mongo from "mongodb";

import dotenv from "dotenv";

const {MongoClient} = mongo
dotenv.config();

const client = new MongoClient(
    `mongodb+srv://${process.env['MONGO_HOST']}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth: {
            user: process.env.MONGO_USER,
            password: process.env.MONGO_PASS
        }
    }
);

const conn = await client.connect();

console.log('Decompressing');

await decompress('data/contracheque.zip', 'data');

console.log('Start dumping');

function transformData(data) {
    const obj = {...data}
    obj['data_referencia'] = new Date(obj['mesano_de_referencia']);
    obj['data_de_publicacao'] = new Date(obj['data_de_publicacao']);

    delete obj['mesano_de_referencia'];
    delete obj['cpf'];
    ['subsidio', 'direitos_pessoais', 'indenizacoes', 'direitos_eventuais',
        'total_de_rendimentos', 'previdencia_publica',
        'imposto_de_renda', 'descontos_diversos',
        'retencao_por_teto_constitucional', 'total_de_descontos',
        'rendimento_liquido', 'remuneracao_do_orgao_de_origem', 'diarias'
    ].forEach(key => obj[key] = parseFloat(obj[key]))
    return obj;
}

const collection = conn.db('olympus').collection('paycheck');

const paycheckData = await csv({
    delimiter: ',',
    ignoreColumns: /cpf/,
}).fromFile('data/contracheque.csv');

const result = await collection.insertMany(paycheckData.map(transformData), {ordered: false});
console.log(JSON.stringify(result))

const resultIndex = collection.createIndex('nome')
console.log(JSON.stringify(resultIndex))
console.log('Finish process');


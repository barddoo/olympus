import csv from 'csvtojson';
import { servidores } from './datasets/servidores';
import mongo, { Collection } from 'mongodb';
import datasets from './datasets.json';
import dotenv from 'dotenv';
import path from 'path';
import moment from 'moment';
import { Converter } from 'csvtojson/v2/Converter';

const { MongoClient } = mongo;
dotenv.config();

const client = new MongoClient(
  `mongodb+srv://${process.env['MONGO_HOST']}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
      user: process.env.MONGO_USER as string,
      password: process.env.MONGO_PASS as string,
    },
  }
);

(async () => {
  const conn = await client.connect();
  const destination = 'dist';
  await servidores(datasets.servidores.downloadUrl, datasets.servidores.fileName, destination);
  const fileDataset: [string, (csvData: Converter, collection: Collection) => Promise<void>][] = [];

  fileDataset.push(['202101_Remuneracao.csv', loadSalaryData]);
  fileDataset.push(['202101_Cadastro.csv', loadEmployeeData]);

  const collection: Collection = conn.db('olympus').collection('salary');
  for (const [file, func] of fileDataset) {
    const csvData: Converter = csv({ delimiter: ';' }).fromFile(path.join(destination, file), {
      encoding: 'latin1',
    });
    await func(csvData, collection);
  }
  await conn.close();
})();

async function loadEmployeeData(csvData: Converter, collection: Collection) {
  let promises: Promise<void>[] = [];
  return new Promise<void>((resolve, reject) => {
    csvData.subscribe(
      async (data, index) => {
        serializeDates(data);
        serializeNumbers(data);
        const obj = removeFieldsEmployee(data);

        promises.push(
          collection
            .findOneAndUpdate({ id_servidor: obj.id_servidor }, { $set: { ...obj } })
            .then((result) => console.log('Update Salary', result.ok))
        );

        if (index % 10000 == 0) {
          await Promise.all(promises);
          promises = [];
        }
      },
      (err) => {
        console.log(err);
        reject(err);
      },
      async () => {
        await Promise.all(promises);
        resolve();
      }
    );
  });
}

async function loadSalaryData(csvData: Converter, collection: Collection) {
  collection.createIndex('id_servidor', (err, result) => {
    if (err) {
      console.log('Error on create index:', err.code, err.message);
    }
    console.log('New index', result);
  });
  let objects: any[] = [];

  return new Promise<void>((resolve, reject) => {
    csvData.subscribe(
      async (data, index) => {
        serializeDates(data);
        serializeNumbers(data);
        const obj = removeFieldsSalary(data);

        objects.push(obj);

        if (index % 40000 == 0) {
          await collection
            .insertMany(objects, { ordered: false })
            .then((result) => console.log('Insert salary', result.result.ok));
          objects = [];
        }
      },
      (err) => {
        console.log(err);
        reject(err);
      },
      async () => {
        await collection
          .insertMany(objects, { ordered: false })
          .then((result) => console.log('Insert salary', result.result.ok));
        resolve();
      }
    );
  });
}

function serializeNumbers(obj: Record<string, any>) {
  for (const [key, value] of Object.entries(obj)) {
    if (/^-?[0-9.,]+$/.test(value)) {
      if (value.includes(',')) {
        obj[key] = parseFloat(value.replace(',', '.'));
      } else {
        obj[key] = parseInt(value);
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

function serializeDates(obj: Record<string, any>) {
  for (const [key, value] of Object.entries(obj)) {
    if (/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(value)) {
      obj[key] = moment(value, 'DD/MM/YYYY').toDate();
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

function removeFieldsEmployee(data: Record<string, any>) {
  const fieldsCadastro = {
    DESCRICAO_CARGO: 'descricao_cargo',
    DIPLOMA_INGRESSO_CARGOFUNCAO: 'ingresso_cargo_funcao',
    DIPLOMA_INGRESSO_SERVICOPUBLICO: 'ingresso_servico_publico',
    Id_SERVIDOR_PORTAL: 'id_servidor',
    ORG_EXERCICIO: 'instituicao',
    ORGSUP_EXERCICIO: 'super_instituicao',
    UF_EXERCICIO: 'estado',
    UORG_EXERCICIO: 'setor_instituicao',
  };
  return renameKeys(data, fieldsCadastro);
}

function removeFieldsSalary(data: Record<string, any>) {
  const keysSalary = {
    ANO: 'ano',
    MES: 'mes',
    Id_SERVIDOR_PORTAL: 'id_servidor',
    NOME: 'nome',
    'REMUNERAÇÃO BÁSICA BRUTA (R$)': 'remuneracao_bruta',
    'ABATE-TETO (R$)': 'abate_teto',
    'GRATIFICAÇÃO NATALINA (R$)': 'gratificacao_natalina',
    'ABATE-TETO DA GRATIFICAÇÃO NATALINA (R$)': 'abate_teto_da_gratificacao_natalina',
    'FÉRIAS (R$)': 'ferias',
    'OUTRAS REMUNERAÇÕES EVENTUAIS (R$)': 'outras_remuneracoes_eventuais',
    'IRRF (R$)': 'irrf',
    'PSS/RPGS (R$)': 'pss_rpgs',
    'DEMAIS DEDUÇÕES (R$)': 'demais_deducoes',
    'PENSÃO MILITAR (R$)': 'pensao_militar',
    'FUNDO DE SAÚDE (R$)': 'fundo_de_saude',
    'TAXA DE OCUPAÇÃO IMÓVEL FUNCIONAL (R$)': 'taxa_de_ocupacao_imovel_funcional',
    'REMUNERAÇÃO APÓS DEDUÇÕES OBRIGATÓRIAS (R$)': 'remuneracao_apos_deducoes_obrigatorias',
    'VERBAS INDENIZATÓRIAS REGISTRADAS EM SISTEMAS DE PESSOAL - CIVIL (R$)(*)':
      'verbas_indenizatorias_civil',
    'VERBAS INDENIZATÓRIAS REGISTRADAS EM SISTEMAS DE PESSOAL - MILITAR (R$)(*)':
      'verbas_indenizatorias_militar',
  };
  return renameKeys(data, keysSalary);
}

function renameKeys(obj: Record<any, any>, newKeys: Record<any, any>) {
  for (const key of Object.keys(obj)) {
    if (!Object.keys(newKeys).includes(key)) delete obj[key];
  }
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

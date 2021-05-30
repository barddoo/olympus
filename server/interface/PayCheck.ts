import { ObjectID } from 'mongodb';

export interface PayCheck {
  _id: ObjectID;
  abate_teto: number;
  abate_teto_da_gratificacao_natalina: number;
  ano: number;
  demais_deducoes: number;
  descricao_cargo: string;
  estado: number;
  ferias: number;
  fundo_de_saude: number;
  gratificacao_natalina: number;
  id_servidor: number;
  ingresso_cargo_funcao: string;
  ingresso_servico_publico: string;
  instituicao: string;
  irrf: number;
  mes: number;
  nome: string;
  outras_remuneracoes_eventuais: number;
  pensao_militar: number;
  pss_rpgs: number;
  remuneracao_apos_deducoes_obrigatorias: number;
  remuneracao_bruta: number;
  setor_instituicao: string;
  super_instituicao: string;
  taxa_de_ocupacao_imovel_funcional: number;
  verbas_indenizatorias_civil: number;
  verbas_indenizatorias_militar: number;
}

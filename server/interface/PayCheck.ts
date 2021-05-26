export interface PayCheck {
  _id: string;
  cpf: string;
  nome: string;
  cargo: string;
  lotacao: string;
  subsidio: number;
  direitos_pessoais: number;
  indenizacoes: number;
  direitos_eventuais: number;
  total_de_rendimentos: string;
  previdencia_publica: number;
  imposto_de_renda: number;
  descontos_diversos: number;
  retencao_por_teto_constitucional: number;
  total_de_descontos: number;
  rendimento_liquido: number;
  remuneracao_do_orgao_de_origem: number;
  diarias: number;
  url: string;
  tribunal: string;
  orgao: string;
  data_de_publicacao: Date;
  data_referencia: Date;
}

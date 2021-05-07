cube(`Salaries`, {
    sql: `SELECT *
          FROM data.salaries`,

    joins: {},

    measures: {
        count: {
            type: `count`
        },
        rendimentos: {
            type: `sum`,
            sql:`total_de_rendimentos`
        }
    },

    dimensions: {
        cargo: {
            sql: `cargo`,
            type: `string`
        },

        cpf: {
            sql: `cpf`,
            type: `string`
        },

        dataDePublicacao: {
            sql: `data_de_publicacao`,
            type: `time`
        },

        descontosDiversos: {
            sql: `descontos_diversos`,
            type: `number`
        },

        diarias: {
            sql: `diarias`,
            type: `number`
        },

        direitosEventuais: {
            sql: `direitos_eventuais`,
            type: `number`
        },

        direitosPessoais: {
            sql: `direitos_pessoais`,
            type: `number`
        },

        impostoDeRenda: {
            sql: `imposto_de_renda`,
            type: `number`
        },

        indenizacoes: {
            sql: `indenizacoes`,
            type: `number`
        },

        lotacao: {
            sql: `lotacao`,
            type: `string`
        },

        mesanoDeReferencia: {
            sql: `mesano_de_referencia`,
            type: `time`
        },

        nome: {
            sql: `nome`,
            type: `string`
        },

        orgao: {
            sql: `orgao`,
            type: `string`
        },

        previdenciaPublica: {
            sql: `previdencia_publica`,
            type: `number`
        },

        remuneracaoDoOrgaoDeOrigem: {
            sql: `remuneracao_do_orgao_de_origem`,
            type: `number`
        },

        rendimentoLiquido: {
            sql: `rendimento_liquido`,
            type: `number`
        },

        retencaoPorTetoConstitucional: {
            sql: `retencao_por_teto_constitucional`,
            type: `number`
        },

        subsidio: {
            sql: `subsidio`,
            type: `number`
        },

        totalDeDescontos: {
            sql: `total_de_descontos`,
            type: `number`
        },

        totalDeRendimentos: {
            sql: `total_de_rendimentos`,
            type: `number`
        },

        tribunal: {
            sql: `tribunal`,
            type: `string`
        },

        url: {
            sql: `url`,
            type: `string`
        }
    },

    dataSource: `default`
});

// cube({
//     extends: Salaries,
// })
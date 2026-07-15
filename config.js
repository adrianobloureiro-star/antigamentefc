// ======================================
// PELADA FC
// Configurações do Aplicativo
// ======================================


// URL da API Google Apps Script

const API_URL = 
"https://script.google.com/macros/s/AKfycbyFjjiafb5xwPaUxdMfJDyUGLqAhxqb56m5IxASgUnmsSmZyEaDvHHjzw6oWl3TNnT6kw/exec";


// ======================================
// Regras do Sistema
// ======================================

const CONFIG_APP = {

    // Quantidade obrigatória para sortear
    JOGADORES_OBRIGATORIOS: 20,


    // Goleiro não é obrigatório
    GOLEIRO_OBRIGATORIO: false,


    // Limite de jogadores de linha
    LIMITE_LINHA: 20,


    // Nota mínima
    NOTA_MINIMA: 1,


    // Nota máxima
    NOTA_MAXIMA: 10,


    // Quantidade de tentativas
    // para encontrar times equilibrados

    TENTATIVAS_SORTEIO: 500

};
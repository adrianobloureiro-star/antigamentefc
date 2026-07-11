    // ======================================
    // PELADA FC
    // Comunicação com Google Sheets API
    // ======================================


    async function buscarJogadores(){

        try{

            const resposta = await fetch(
                API_URL + "?action=listarJogadores"
            );


            const dados = await resposta.json();


            return dados;


        }catch(erro){

            console.error(
                "Erro ao buscar jogadores:",
                erro
            );


            return [];

        }

    }




    // ======================================
    // Adicionar jogador
    // ======================================

    async function adicionarJogadorAPI(
        nome,
        posicao,
        nota
    ){

        const dados = {

            action:"adicionarJogador",

            nome:nome,

            posicao:posicao,

            nota:Number(nota)

        };


        return enviarDados(dados);

    }





    // ======================================
    // Atualizar presença
    // ======================================

    async function atualizarPresencaAPI(
        id,
        presente
    ){

        const dados = {

            action:"atualizarPresenca",

            id:id,

            presente:presente

        };


        return enviarDados(dados);

    }





    // ======================================
    // Editar jogador
    // ======================================

    async function editarJogadorAPI(
        id,
        nome,
        posicao,
        nota
    ){

        const dados = {

            action:"editarJogador",

            id:id,

            nome:nome,

            posicao:posicao,

            nota:Number(nota)

        };


        return enviarDados(dados);

    }





    // ======================================
    // Excluir jogador
    // ======================================

    async function excluirJogadorAPI(id){


        const dados = {

            action:"excluirJogador",

            id:id

        };


        return enviarDados(dados);


    }





    // ======================================
    // Envio padrão para API
    // ======================================

    async function enviarDados(dados){


        try{


            const resposta = await fetch(
                API_URL,
                {

                    method:"POST",

                    body:JSON.stringify(dados)

                }
            );


            return await resposta.json();



        }catch(erro){


            console.error(
                "Erro API:",
                erro
            );


            return {

                sucesso:false

            };


        }


    }
    // ======================================
// Buscar Ranking Geral
// ======================================

async function buscarRanking(){

    try{

        const resposta = await fetch(
            API_URL + "?action=listarRanking"
        );

        const dados = await resposta.json();

        return dados;

    }catch(erro){

        console.error(
            "Erro ao buscar ranking:",
            erro
        );

        return [];

    }

}

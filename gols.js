    // =================================
    // PELADA FC - CONTROLE DE GOLS
    // =================================


    let gols = {};

    let jogadoresGols = [];



    // Inicialização

    document.addEventListener("DOMContentLoaded", function(){


        mostrarData();


        carregarJogadoresGols();


    });





    // =================================
    // Mostrar data atual
    // =================================

    function mostrarData(){


        const campoData =
        document.getElementById("dataAtual");


        if(campoData){


            campoData.innerHTML =
            new Date().toLocaleDateString("pt-BR");


        }


    }





    // =================================
    // Carregar jogadores da planilha
    // =================================

    async function carregarJogadoresGols(){


        const lista =
        document.getElementById("listaGols");


        lista.innerHTML =
        "Carregando jogadores...";


        try{


            // Usa a mesma função já existente no api.js

            jogadoresGols = await buscarJogadores();



            lista.innerHTML = "";



            // Ordena alfabeticamente

            jogadoresGols.sort((a,b)=>{

                return a.nome.localeCompare(b.nome);

            });





            jogadoresGols.forEach(jogador=>{


                gols[jogador.id] = 0;



                lista.innerHTML += `


                <div class="linhaGol">


                    <strong>

                        ${jogador.nome}

                    </strong>



                    <div class="controleGol">


                        <button 
                        onclick="adicionarGol('${jogador.id}')">

                            🥅⚽

                        </button>



                        <span id="gol-${jogador.id}">

                            0

                        </span>



                        <button
                        onclick="diminuirGol('${jogador.id}')">

                            ➖

                        </button>


                    </div>



                </div>


                `;


            });



            atualizarRanking();



        }
        catch(erro){


            console.error(
                "Erro ao carregar jogadores:",
                erro
            );


            lista.innerHTML =
            "Erro ao carregar jogadores";


        }



    }





    // =================================
    // Adicionar gol
    // =================================

    function adicionarGol(id){


        if(!gols[id]){

            gols[id] = 0;

        }


        gols[id]++;


        atualizarGol(id);


        atualizarRanking();



    }





    // =================================
    // Diminuir gol
    // =================================

    function diminuirGol(id){


        if(gols[id] > 0){


            gols[id]--;


        }


        atualizarGol(id);


        atualizarRanking();



    }





    // =================================
    // Atualiza número na tela
    // =================================

    function atualizarGol(id){


        const campo =
        document.getElementById(
            "gol-" + id
        );



        if(campo){


            campo.innerHTML =
            gols[id];


        }



    }





    // =================================
    // Ranking de artilheiros
    // =================================

    function atualizarRanking(){


        const ranking =
        document.getElementById(
            "rankingGols"
        );



        if(!ranking){

            return;

        }



        ranking.innerHTML = "";



        let listaRanking =
        jogadoresGols.map(jogador=>{


            return {


                nome:
                jogador.nome,


                gols:
                gols[jogador.id] || 0


            };


        });





        listaRanking.sort((a,b)=>{

            return b.gols - a.gols;

        });





        listaRanking.forEach((jogador,index)=>{


            ranking.innerHTML += `


            <p>

            ${index + 1}º 
            ${jogador.nome}

            -

            ⚽ ${jogador.gols}

            </p>


            `;


        });



    }





    // =================================
    // Voltar para página principal
    // =================================

    function voltarInicio(){


        window.location.href =
        "index.html";


    }





    // =================================
    // Salvar (iremos ligar depois)
    // =================================

   function salvarGols(){


    let listaGols = [];


    jogadoresGols.forEach(jogador=>{


        listaGols.push({

            nome: jogador.nome,

            gols: gols[jogador.id] || 0

        });


    });



    const dados = {


        action:"salvarGols",


        gols: listaGols


    };



    enviarDados(dados)

    .then(resposta=>{


        if(resposta.sucesso){


            alert(
                "✅ Gols salvos com sucesso!"
            );


        }else{


            alert(
                "❌ Erro ao salvar gols."
            );


        }


    })


    .catch(erro=>{


        console.error(
            erro
        );


        alert(
            "Erro de comunicação."
        );


    });



}
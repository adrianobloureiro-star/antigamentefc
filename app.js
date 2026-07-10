        // ======================================
        // PELADA FC
        // Controle Principal do Aplicativo
        // ======================================


        let jogadores = [];



        // Quando abrir o aplicativo

        document.addEventListener(
            "DOMContentLoaded",
            iniciarSistema
        );




        // ======================================
        // Inicialização
        // ======================================

        async function iniciarSistema(){

            jogadores = await buscarJogadores();

            mostrarJogadores();

            atualizarContadores();


        }



        // ======================================
        // Mostrar jogadores na tela
        // ======================================

        function mostrarJogadores(){


            const lista =
            document.getElementById(
                "listaJogadores"
            );


            lista.innerHTML="";



            jogadores.forEach(jogador=>{


                if(!jogador.ativo)
                    return;



                const div =
                document.createElement(
                    "div"
                );


                div.className="jogador";



                div.innerHTML = `


                <div class="info">


                    <span class="nome">

                        ${jogador.nome}

                    </span>


                    <span class="detalhes">

                        ${jogador.posicao}
                        |
                        ⭐ ${jogador.nota}

                    </span>


                </div>


                <div class="acoes">


                    <input 
                    type="checkbox"
                    ${jogador.presente ? "checked":""}

                    onchange="
                    mudarPresenca(
                    ${jogador.id},
                    this.checked
                    )
                    ">


                    <button class="btnExcluir" data-id="${jogador.id}">

        🗑

                    </button>


                </div>


                `;


                lista.appendChild(div);
                const botoesExcluir = 
        document.querySelectorAll(".btnExcluir");


        botoesExcluir.forEach(botao=>{


            botao.addEventListener(
                "click",
                ()=>{

                    excluirJogador(
                        botao.dataset.id
                    );

                }
            );


        });



            });


        }



        // ======================================
        // Alterar presença
        // ======================================

        async function mudarPresenca(
            id,
            valor
        ){


            await atualizarPresencaAPI(
                id,
                valor
            );


            const jogador =
            jogadores.find(
                j=>j.id==id
            );


            jogador.presente =
            valor;


            atualizarContadores();


        }





        // ======================================
        // Contadores
        // ======================================

        function atualizarContadores(){


            let linha=0;

            let goleiros=0;



            jogadores.forEach(j=>{


                if(
                    j.ativo &&
                    j.presente
                ){


                    if(j.posicao=="GOL"){

                        goleiros++;

                    }else{

                        linha++;

                    }


                }


            });



            document.getElementById(
                "contadorLinha"
            ).innerHTML =
            linha+" / 20";



            document.getElementById(
                "contadorGoleiros"
            ).innerHTML =
            goleiros;



        }



        // ======================================
        // Marcar todos
        // ======================================

        async function marcarTodos(){


            for(let jogador of jogadores){


                if(jogador.ativo){


                    jogador.presente=true;


                    await atualizarPresencaAPI(
                        jogador.id,
                        true
                    );

                }

            }


            mostrarJogadores();

            atualizarContadores();


        }





        // ======================================
        // Limpar presenças
        // ======================================

        async function limparPresencas(){


            if(
                !confirm(
                "Deseja retirar todos da lista?"
                )
            )
            return;



            for(let jogador of jogadores){


                if(jogador.ativo){


                    jogador.presente=false;


                    await atualizarPresencaAPI(
                        jogador.id,
                        false
                    );

                }

            }



            mostrarJogadores();

            atualizarContadores();


        }



        // ======================================
        // Excluir jogador
        // ======================================

        async function excluirJogador(id){


            if(
                !confirm(
                "Excluir jogador?"
                )
            )
            return;


            await excluirJogadorAPI(id);



            jogadores =
            jogadores.filter(
                j=>j.id!=id
            );


            mostrarJogadores();

            atualizarContadores();


        }





        // ======================================
        // Cadastro jogador
        // ======================================

        document
        .getElementById(
        "btnAdicionar"
        )
        .addEventListener(
        "click",
        async()=>{


            const nome =
            document.getElementById(
            "nome"
            ).value;



            const posicao =
            document.getElementById(
            "posicao"
            ).value;



            const nota =
            document.getElementById(
            "nota"
            ).value;



            if(!nome){

                alert(
                "Digite o nome do jogador"
                );

                return;

            }



            await adicionarJogadorAPI(
                nome,
                posicao,
                nota
            );



            alert(
            "Jogador cadastrado!"
            );



            location.reload();



        });
        // ======================================
        // Botões de presença
        // ======================================


        document
        .getElementById(
        "btnMarcarTodos"
        )
        .addEventListener(
        "click",
        marcarTodos
        );



        document
        .getElementById(
        "btnLimparPresencas"
        )
        .addEventListener(
        "click",
        limparPresencas
        );
        function abrirGols(){

        window.location.href = "gols.html";

    }
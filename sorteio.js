                        // ======================================
                        // PELADA FC
                        // Algoritmo de Sorteio Inteligente
                        // ======================================


                        let ultimoSorteio = null;



                        // ======================================
                        // Botão Sortear
                        // ======================================

                        document
                        .getElementById("btnSortear")
                        .addEventListener(
                        "click",
                        ()=>{

                            sortearTimes();

                        });



                        // ======================================
                        // Botão Ressortear
                        // ======================================

                        document
                        .getElementById("btnRessortear")
                        .addEventListener(
                        "click",
                        ()=>{

                            sortearTimes();

                        });




                        // ======================================
                        // Sorteio principal
                        // ======================================

                        function sortearTimes(){


                            const presentes =
                            jogadores.filter(
                                j=>j.presente &&
                                j.ativo
                            );



                            const linha =
                            presentes.filter(
                                j=>j.posicao!="GOL"
                            );


                            const goleiros =
                            presentes.filter(
                                j=>j.posicao=="GOL"
                            );



                            if(
                                linha.length !=
                                CONFIG_APP.JOGADORES_OBRIGATORIOS
                            ){

                                alert(
                                "É necessário ter exatamente 20 jogadores de linha presentes."
                                );

                                return;

                            }



                            let melhorResultado=null;

                            let menorDiferenca=999;



                            // tenta várias combinações

                            for(
                                let i=0;
                                i<CONFIG_APP.TENTATIVAS_SORTEIO;
                                i++
                            ){


                                const resultado =
                                gerarTimes(
                                    linha
                                );



                                const diferenca =
                                Math.abs(
                                    resultado.timeA.nota -
                                    resultado.timeB.nota
                                );



                                if(
                                    diferenca <
                                    menorDiferenca
                                ){

                                    menorDiferenca =
                                    diferenca;


                                    melhorResultado =
                                    resultado;


                                }



                                if(
                                    diferenca==0
                                )
                                break;


                            }



                            distribuirGoleiros(
                                melhorResultado,
                                goleiros
                            );



                            ultimoSorteio =
                            melhorResultado;



                            mostrarResultado(
                                melhorResultado
                            );


                        }




                        // ======================================
                        // Gera times equilibrados
                        // ======================================

                        function gerarTimes(lista){


                            let jogadoresOrdenados =
                            [...lista]
                            .sort(
                                ()=>Math.random()-0.5
                            );



                            jogadoresOrdenados =
                            jogadoresOrdenados.sort(
                                (a,b)=>
                                b.nota-a.nota
                            );



                            let timeA={

                                jogadores:[],
                                nota:0

                            };


                            let timeB={

                                jogadores:[],
                                nota:0

                            };



                            jogadoresOrdenados.forEach(
                            jogador=>{


                                if(
                                    timeA.nota <=
                                    timeB.nota
                                ){

                                    timeA.jogadores.push(
                                        jogador
                                    );

                                    timeA.nota +=
                                    Number(jogador.nota);


                                }else{


                                    timeB.jogadores.push(
                                        jogador
                                    );


                                    timeB.nota +=
                                    Number(jogador.nota);


                                }


                            });



                            return {

                                timeA,
                                timeB

                            };


                        }





                        // ======================================
                        // Distribuir goleiros
                        // ======================================

                        function distribuirGoleiros(
                        resultado,
                        goleiros
                        ){


                            if(
                                goleiros.length>=2
                            ){


                                resultado.timeA.jogadores
                                .unshift(
                                    goleiros[0]
                                );


                                resultado.timeB.jogadores
                                .unshift(
                                    goleiros[1]
                                );


                            }


                            else if(
                                goleiros.length==1
                            ){


                                resultado.timeA.jogadores
                                .unshift(
                                    goleiros[0]
                                );


                            }


                        }




                        // ======================================
                        // Mostrar resultado
                        // ======================================

            // ======================================
            // Mostrar resultado
            // ======================================

            function mostrarResultado(resultado){

                const area = document.getElementById("resultado");

                area.style.display = "block";

                const diferenca = Math.abs(
                    resultado.timeA.nota - resultado.timeB.nota
                );

                area.innerHTML = `

                    <h2 style="text-align:center;">
                        ⚽ ANTIGAMENTE FUTEBOL CLUBE
                    </h2>

                    <div class="campoTime">

                        <h2>🟢 TIME A</h2>

                        ${campoTatico(resultado.timeA)}

                        <div class="total">
                            Total ⭐ ${resultado.timeA.nota}
                        </div>

                    </div>

                    <hr>

                    <div class="campoTime">

                        <h2>⚫ TIME B</h2>

                        ${campoTatico(resultado.timeB)}

                        <div class="total">
                            Total ⭐ ${resultado.timeB.nota}
                        </div>

                    </div>

                    <hr>

                    <h3 style="text-align:center;">
                        Diferença de Pontos ⭐ ${diferenca}
                    </h3>

                `;

            }




                        function listaTime(time){


                            let html="";


                            time.jogadores.forEach(j=>{


                                html += `


                                <div class="jogadorCampo">


                                    <strong>

                                    ⚽ ${j.nome}

                                    </strong>


                                    <span>

                                    ${j.posicao}

                                    </span>


                                    <small>

                                    ⭐ ${j.nota}

                                    </small>


                                </div>


                                `;


                            });



                            return html;


                        }
                    function campoTatico(time){

            const ordem = [
                "GOL","ZAG","ZAG","LAT","LAT",
                "VOL","VOL","MEI","MEI","ATA"
            ];

            // Organiza jogadores por posição
            const grupos = {
                GOL: [],
                ZAG: [],
                LAT: [],
                VOL: [],
                MEI: [],
                ATA: []
            };

            time.jogadores.forEach(j=>{
                if(grupos[j.posicao]){
                    grupos[j.posicao].push(j);
                }
            });

            // Jogadores já utilizados
            const usados = [];

            // Procura um jogador disponível
            function pegarJogador(posicao){

                // Primeiro tenta da posição correta
                while(grupos[posicao].length){

                    const jogador = grupos[posicao].shift();

                    if(!usados.includes(jogador)){
                        usados.push(jogador);
                        return jogador;
                    }

                }

                // Depois procura qualquer outro jogador ainda não usado
                for(const p in grupos){

                    while(grupos[p].length){

                        const jogador = grupos[p].shift();

                        if(!usados.includes(jogador)){
                            usados.push(jogador);
                            return jogador;
                        }

                    }

                }

                return null;

            }

            // Monta escalação
            const escala = {};

            ordem.forEach((posicao,index)=>{

                escala[index] = pegarJogador(posicao);

            });

            // Retorna apenas o primeiro nome
            function nome(j){

                if(!j) return "";

                return j.nome.split(" ")[0];

            }

            return `

            <div class="formacao">

        <div class="linhaForm ATA">
            ${escala[9] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[9])}</strong>
                <small>${escala[9].posicao} | ⭐${escala[9].nota}</small>
            </div>` : ""}
        </div>

        <div class="linhaForm MEI">
            ${escala[7] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[7])}</strong>
                <small>${escala[7].posicao} | ⭐${escala[7].nota}</small>
            </div>` : ""}

            ${escala[8] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[8])}</strong>
                <small>${escala[8].posicao} | ⭐${escala[8].nota}</small>
            </div>` : ""}
        </div>

        <div class="linhaForm">
            ${escala[3] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[3])}</strong>
                <small>${escala[3].posicao} | ⭐${escala[3].nota}</small>
            </div>` : ""}

            ${escala[5] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[5])}</strong>
                <small>${escala[5].posicao} | ⭐${escala[5].nota}</small>
            </div>` : ""}

            ${escala[6] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[6])}</strong>
                <small>${escala[6].posicao} | ⭐${escala[6].nota}</small>
            </div>` : ""}

            ${escala[4] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[4])}</strong>
                <small>${escala[4].posicao} | ⭐${escala[4].nota}</small>
            </div>` : ""}
        </div>

        <div class="linhaForm ZAG">
            ${escala[1] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[1])}</strong>
                <small>${escala[1].posicao} | ⭐${escala[1].nota}</small>
            </div>` : ""}

            ${escala[2] ? `
            <div class="jogadorTatico">
                <strong>${nome(escala[2])}</strong>
                <small>${escala[2].posicao} | ⭐${escala[2].nota}</small>
            </div>` : ""}
        </div>

        <div class="linhaForm GOL">
            ${escala[0] ? `
            <div class="jogadorTatico">
                <strong>🧤 ${nome(escala[0])}</strong>
                <small>${escala[0].posicao} | ⭐${escala[0].nota}</small>
            </div>` : ""}
        </div>

    </div>
            `;

        }

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

            function mostrarResultado(
            resultado
            ){


                const area =
                document.getElementById(
                    "resultado"
                );


                area.style.display="block";



                area.innerHTML = `


            <div class="campo-container">


            <div class="campo">


                <div class="meio-campo"></div>


                <div class="circulo-central"></div>



                <div class="timeCampo timeA">


                    <h2>
                    🟢 TIME A
                    </h2>


                    ${campoTatico(resultado.timeA)}


                    <div class="total">

                    Total ⭐ ${resultado.timeA.nota}

                    </div>


                </div>





                <div class="timeCampo timeB">


                    <h2>
                    ⚫ TIME B
                    </h2>


                    ${campoTatico(resultado.timeB)}


                    <div class="total">

                    Total ⭐ ${resultado.timeB.nota}

                    </div>


                </div>



            </div>


        </div>

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


let posicoes = {

    GOL:[],
    ZAG:[],
    LAT:[],
    VOL:[],
    MEI:[],
    ATA:[]

};



time.jogadores.forEach(j=>{


    if(posicoes[j.posicao]){


        posicoes[j.posicao].push(`


        <div class="jogadorTatico">

            <strong>
            ${j.nome}
            </strong>


            <small>
            ${j.posicao}
            </small>


        </div>


        `);


    }


});




return `


<div class="formacao">


<div class="linhaForm ATA">

    ${posicoes.ATA.join("")}

</div>



<div class="linhaForm MEI">

    ${posicoes.MEI.join("")}

</div>



<div class="linhaForm">

    ${posicoes.LAT.join("")}

    ${posicoes.VOL.join("")}

</div>



<div class="linhaForm ZAG">

    ${posicoes.ZAG.join("")}

</div>



<div class="linhaForm GOL">

    🧤

    ${posicoes.GOL.join("")}

</div>



</div>


`;

}
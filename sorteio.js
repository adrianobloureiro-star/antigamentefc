
// ======================================
// PELADA FC
// Sorteador Inteligente de Times
// Nova lógica
// ======================================


let ultimoSorteio = null;


// ======================================
// BOTÃO SORTEAR
// ======================================

document
    .getElementById("btnSortear")
    .addEventListener(
        "click",
        () => {

            sortearTimes();

        });
botao.onclick =
    sortearTimes;



// ======================================
// FUNÇÃO PRINCIPAL DO SORTEIO
// ======================================

function sortearTimes() {


    // jogadores marcados como presentes

    const presentes = jogadores.filter(
        jogador =>
            jogador.presente &&
            jogador.ativo
    );



    // separa linha e goleiros

    const linha = presentes.filter(
        jogador =>
            jogador.posicao !== "GOL"
    );


    const goleiros = presentes.filter(
        jogador =>
            jogador.posicao === "GOL"
    );



    // validação dos jogadores

    if (
        linha.length !== 20 ||
        goleiros.length !== 2
    ) {


        alert(
            "O sorteio precisa ter exatamente 20 jogadores de linha e 2 goleiros presentes."
        );


        return;

    }


    // ======================================
    // GERA OS TIMES
    // ======================================


    const resultado =
        gerarTimes(presentes);



    ultimoSorteio =
        resultado;



    exibirResultado(
        resultado
    );


}
// ======================================
// BLOCO 2/3
// GERAÇÃO DOS TIMES
// Distribuição por posição
// ======================================


function gerarTimes(lista) {


    const grupos = {


        GOL: [],
        ZAG: [],
        LAT: [],
        VOL: [],
        MEI: [],
        ATA: []


    };



    // ======================================
    // Separar jogadores por posição
    // ======================================


    lista.forEach(jogador => {


        if (grupos[jogador.posicao]) {


            grupos[jogador.posicao]
                .push(jogador);


        }


    });




    const timeA = {


        jogadores: [],
        nota: 0


    };



    const timeB = {


        jogadores: [],
        nota: 0


    };





    // ======================================
    // Distribuir posições entre os times
    // ======================================

    Object.keys(grupos).forEach(posicao => {

        const jogadoresPosicao = grupos[posicao];

        // Ordena do maior para o menor
        jogadoresPosicao.sort((a, b) => Number(b.nota) - Number(a.nota));

        let notaPosA = 0;
        let notaPosB = 0;

        while (jogadoresPosicao.length > 0) {

            const jogador = jogadoresPosicao.shift();

            // Time mais fraco naquela posição recebe o próximo jogador
            if (notaPosA <= notaPosB) {

                timeA.jogadores.push(jogador);
                notaPosA += Number(jogador.nota);

            } else {

                timeB.jogadores.push(jogador);
                notaPosB += Number(jogador.nota);

            }

        }

    });


    // ======================================
    // Calcular pontuação dos times
    // ======================================


    timeA.nota =
        timeA.jogadores.reduce(
            (total, jogador) => {


                return total +
                    Number(jogador.nota || 0);


            },
            0
        );




    timeB.nota =
        timeB.jogadores.reduce(
            (total, jogador) => {


                return total +
                    Number(jogador.nota || 0);


            },
            0
        );



    // ======================================
    // Ajusta quantidade de jogadores
    // sempre 11 x 11
    // ======================================


    while (
        timeA.jogadores.length >
        timeB.jogadores.length
    ) {


        const jogador =
            timeA.jogadores.pop();


        timeB.jogadores.push(
            jogador
        );


    }



    while (
        timeB.jogadores.length >
        timeA.jogadores.length
    ) {


        const jogador =
            timeB.jogadores.pop();


        timeA.jogadores.push(
            jogador
        );


    }

    // ======================================
    // Equilibrar pontuação dos times
    // mantendo posições
    // ======================================


    for (
        let tentativa = 0;
        tentativa < 100;
        tentativa++
    ) {


        const diferencaAtual =
            Math.abs(
                timeA.nota -
                timeB.nota
            );
        // se a diferença já está aceitável,
        // encerra o ajuste

        if (
            diferencaAtual <= 5
        ) {

            break;

        }


        let melhorTroca = null;

        let menorDiferenca =
            diferencaAtual;



        for (
            const jogadorA of timeA.jogadores
        ) {


            for (
                const jogadorB of timeB.jogadores
            ) {


                // troca somente mesma posição

                if (
                    jogadorA.posicao !==
                    jogadorB.posicao
                ) {

                    continue;

                }



                const novaNotaA =
                    timeA.nota -
                    Number(jogadorA.nota) +
                    Number(jogadorB.nota);



                const novaNotaB =
                    timeB.nota -
                    Number(jogadorB.nota) +
                    Number(jogadorA.nota);



                const novaDiferenca =
                    Math.abs(
                        novaNotaA -
                        novaNotaB
                    );



                if (
                    novaDiferenca <
                    menorDiferenca
                ) {


                    menorDiferenca =
                        novaDiferenca;



                    melhorTroca = {

                        jogadorA,
                        jogadorB,
                        novaNotaA,
                        novaNotaB

                    };


                }


            }


        }



        if (
            !melhorTroca
        ) {

            break;

        }



        const posA =
            timeA.jogadores.indexOf(
                melhorTroca.jogadorA
            );


        const posB =
            timeB.jogadores.indexOf(
                melhorTroca.jogadorB
            );



        timeA.jogadores[posA] =
            melhorTroca.jogadorB;



        timeB.jogadores[posB] =
            melhorTroca.jogadorA;



        timeA.nota =
            melhorTroca.novaNotaA;



        timeB.nota =
            melhorTroca.novaNotaB;


    }

    return {


        timeA,
        timeB


    };


}
// ======================================
// BLOCO 3/3
// EXIBIÇÃO DOS TIMES
// ======================================



// ======================================
// Atualiza a função principal
// ======================================


// ======================================
// EXIBIR RESULTADO
// Mapa + Lista dos jogadores
// ======================================

function exibirResultado(resultado) {


    const area =
        document.getElementById(
            "resultado"
        );
    area.style.display = "block";


    area.innerHTML = `
        ...
    `;


    const botao =
        document.getElementById(
            "btnSortear"
        );


    botao.innerHTML = "🔄 Ressortear";
    botao.onclick = sortearNovamente;



    area.style.display = "block";



    area.innerHTML = `


        <h2 style="text-align:center;">
            ⚽ PELADA FC
        </h2>



        <div class="timesResultado">


            <div class="time">


                <h2>
                    🟢 TIME A
                </h2>



                ${mapaTatico(
        resultado.timeA
    )}



                <br>



                ${listaEscalacao(
        resultado.timeA
    )}



                <h3>
                    ⭐ Total:
                    ${resultado.timeA.nota}
                </h3>


            </div>





            <div class="time">


                <h2>
                    ⚫ TIME B
                </h2>



                ${mapaTatico(
        resultado.timeB
    )}



                <br>



                ${listaEscalacao(
        resultado.timeB
    )}



                <h3>
                    ⭐ Total:
                    ${resultado.timeB.nota}
                </h3>


            </div>



        </div>


    `;


}


// ======================================
// Lista dos jogadores
// ======================================


function listaEscalacao(time) {


    let html = `


        <div class="listaJogadores">


            <table>


                <tr>

                    <th>
                        Jogador
                    </th>

                    <th>
                        Posição
                    </th>

                    <th>
                        Nota
                    </th>


                </tr>


    `;



    time.jogadores.forEach(
        jogador => {



            html += `


                <tr>


                    <td>
                        ${jogador.nome}
                    </td>


                    <td>
                        ${jogador.posicao}
                    </td>


                    <td>
                        ⭐ ${jogador.nota}
                    </td>


                </tr>


            `;


        });



    html += `


            </table>


        </div>


    `;



    return html;


}





// ======================================
// Completa o botão de sorteio
// ======================================

// ======================================
// RESSORTEAR
// Novo sorteio completo
// ======================================

function sortearNovamente() {


    const presentes =
        jogadores.filter(
            jogador =>
                jogador.presente &&
                jogador.ativo
        );



    // embaralha profundamente a lista

    presentes.sort(
        () =>
            Math.random() - 0.5
    );


    presentes.sort(
        () =>
            Math.random() - 0.5
    );



    const novoResultado =
        gerarTimes(
            presentes
        );



    ultimoSorteio =
        novoResultado;



    exibirResultado(
        novoResultado
    );


}
// ======================================
// MAPA TÁTICO
// Mantém classes originais do CSS
// ======================================


function mapaTatico(time) {


    const jogadores =
        [...time.jogadores].reverse();



    function jogadorHTML(jogador) {


        if (!jogador)
            return "";



        return `

            <div class="jogadorTatico">

                <strong>
                    ${jogador.nome.split(" ")[0]}
                </strong>


                <small>

                    ${jogador.posicao}

                    |

                    ⭐${jogador.nota}

                </small>


            </div>

        `;


    }




    // separa apenas para visualização

    const escala = [

        jogadores.shift(), // ataque
        jogadores.shift(),

        jogadores.shift(), // meia
        jogadores.shift(),

        jogadores.shift(), // linha
        jogadores.shift(),
        jogadores.shift(),
        jogadores.shift(),

        jogadores.shift(), // zaga
        jogadores.shift(),

        jogadores.shift()  // goleiro

    ];





    return `


<div class="formacao">


    <div class="linhaForm ATA">

        ${jogadorHTML(escala[0])}

        ${jogadorHTML(escala[1])}


    </div>




    <div class="linhaForm MEI">


        ${jogadorHTML(escala[2])}

        ${jogadorHTML(escala[3])}


    </div>




    <div class="linhaForm">


        ${jogadorHTML(escala[4])}

        ${jogadorHTML(escala[5])}

        ${jogadorHTML(escala[6])}

        ${jogadorHTML(escala[7])}


    </div>




    <div class="linhaForm ZAG">


        ${jogadorHTML(escala[8])}

        ${jogadorHTML(escala[9])}


    </div>




    <div class="linhaForm GOL">


        ${jogadorHTML(escala[10])}


    </div>



</div>


`;

}

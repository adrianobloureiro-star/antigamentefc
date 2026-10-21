
// ======================================
// PELADA FC
// Sorteador Inteligente de Times
// Nova lógica
// ======================================


let ultimoSorteio = null;
// ======================================
// RESTRIÇÕES FIXAS
// ======================================

const restricoesFixas = [

["ADAIL", "Joaquim"],
//["Hamilton", "Jeffinho"]

];

// ======================================
// RESTRIÇÕES DA SESSÃO
// ======================================

// Se o app.js já criou esta variável,
// aproveitamos a mesma.


if (typeof restricoes === "undefined") {
var restricoes = [];
}

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

function possuiRestricao(time, jogador) {

const todasRestricoes = [
    ...restricoesFixas,
    ...restricoes
];

return todasRestricoes.some(([jogador1, jogador2]) => {

    if (jogador.nome === jogador1) {

        return time.jogadores.some(
            j => j.nome === jogador2
        );

    }

    if (jogador.nome === jogador2) {

        return time.jogadores.some(
            j => j.nome === jogador1
        );

    }

    return false;

});

}

// ======================================
// Distribuir posições entre os times
// Ordem: ZAG, LAT, VOL, MEI, ATA
// Padrão: A, B, B, A
// ======================================

// Coloca um goleiro em cada time
const goleirosOrdenados = [...grupos.GOL].sort(
    (a, b) => Number(b.nota) - Number(a.nota)
);

if (goleirosOrdenados.length !== 2) {
    throw new Error(
        "O sorteio precisa ter exatamente 2 goleiros."
    );
}

timeA.jogadores.push(goleirosOrdenados[0]);
timeB.jogadores.push(goleirosOrdenados[1]);

// Distribui primeiro as posições de linha
const ordemPosicoes = ["ZAG", "LAT", "VOL", "MEI", "ATA"];

ordemPosicoes.forEach(posicao => {
    const jogadoresPosicao = [...grupos[posicao]];

    // Ordena da maior nota para a menor.
    // Em caso de empate, embaralha os empatados.
    jogadoresPosicao.sort(
        (a, b) => Number(b.nota) - Number(a.nota)
    );

    for (let i = 0; i < jogadoresPosicao.length;) {
        let j = i + 1;

        while (
            j < jogadoresPosicao.length &&
            Number(jogadoresPosicao[j].nota) ===
            Number(jogadoresPosicao[i].nota)
        ) {
            j++;
        }

        for (let k = j - 1; k > i; k--) {
            const aleatorio =
                i + Math.floor(Math.random() * (k - i + 1));

            [jogadoresPosicao[k], jogadoresPosicao[aleatorio]] =
                [jogadoresPosicao[aleatorio], jogadoresPosicao[k]];
        }

        i = j;
    }

    jogadoresPosicao.forEach((jogador, indice) => {
        // Padrão repetido: A, B, B, A
        const ciclo = indice % 4;
        const destinoPreferido =
            ciclo === 0 || ciclo === 3 ? timeA : timeB;

        const outroTime =
            destinoPreferido === timeA ? timeB : timeA;

        if (!possuiRestricao(destinoPreferido, jogador)) {
            destinoPreferido.jogadores.push(jogador);
        } else if (!possuiRestricao(outroTime, jogador)) {
            // Se houver conflito, prioriza respeitar a restrição
            outroTime.jogadores.push(jogador);
        } else {
            throw new Error(
                `Não foi possível distribuir ${jogador.nome} sem violar as restrições.`
            );
        }
    });
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

// ======================================
// Garantir 11 jogadores por time
// sem violar posições ou restrições
// ======================================

const restricoesParaAjuste = [
    ...restricoesFixas,
    ...restricoes
];

function existeConflitoNoTime(jogadoresTime) {
    return restricoesParaAjuste.some(([nome1, nome2]) =>
        jogadoresTime.some(j => j.nome === nome1) &&
        jogadoresTime.some(j => j.nome === nome2)
    );
}

while (
    timeA.jogadores.length > timeB.jogadores.length ||
    timeB.jogadores.length > timeA.jogadores.length
) {
    const timeMaior =
        timeA.jogadores.length > timeB.jogadores.length
            ? timeA
            : timeB;

    const timeMenor =
        timeMaior === timeA ? timeB : timeA;

    let jogadorParaMover = null;

    // Procura um jogador cuja mudança preserve as restrições.
    for (const jogador of timeMaior.jogadores) {
        const timeMaiorTeste = timeMaior.jogadores.filter(
            j => j !== jogador
        );

        const timeMenorTeste = [
            ...timeMenor.jogadores,
            jogador
        ];

        if (
            !existeConflitoNoTime(timeMaiorTeste) &&
            !existeConflitoNoTime(timeMenorTeste)
        ) {
            jogadorParaMover = jogador;
            break;
        }
    }

    // Se não houver movimentação segura, interrompe sem
    // mover jogadores de forma que viole as restrições.
    if (!jogadorParaMover) {
        throw new Error(
            "Não foi possível igualar os times sem violar as restrições."
        );
    }

    timeMaior.jogadores =
        timeMaior.jogadores.filter(
            j => j !== jogadorParaMover
        );

    timeMenor.jogadores.push(jogadorParaMover);
}
timeA.nota = timeA.jogadores.reduce(
(total, jogador) => total + Number(jogador.nota || 0),
0
);

timeB.nota = timeB.jogadores.reduce(
(total, jogador) => total + Number(jogador.nota || 0),
0
);
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

            
            // Trocar somente jogadores da mesma posição
           // Não trocar goleiros nem jogadores de posições diferentes
if (
    jogadorA.posicao === "GOL" ||
    jogadorB.posicao === "GOL" ||
    jogadorA.posicao !== jogadorB.posicao
) {
    continue;
}
            // Verifica as restrições após a troca hipotética
            const restricoesTodas = [
                ...restricoesFixas,
                ...restricoes
            ];

            const timeAposTroca = timeA.jogadores
                .filter(j => j !== jogadorA)
                .concat(jogadorB);

            const timeBaposTroca = timeB.jogadores
                .filter(j => j !== jogadorB)
                .concat(jogadorA);

            function possuiConflitoRestricao(jogadoresTime) {
                return restricoesTodas.some(([nome1, nome2]) =>
                    jogadoresTime.some(j => j.nome === nome1) &&
                    jogadoresTime.some(j => j.nome === nome2)
                );
            }

            if (
                possuiConflitoRestricao(timeAposTroca) ||
                possuiConflitoRestricao(timeBaposTroca)
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

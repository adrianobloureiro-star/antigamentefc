// =================================
// PELADA FC - CONTROLE DE GOLS
// =================================

let gols = {};
let jogadoresGols = [];

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
    mostrarData();
    carregarJogadoresGols();
});

// =================================
// Mostrar data atual
// =================================
function mostrarData() {
    const campoData = document.getElementById("dataAtual");
    if (campoData) {
        campoData.innerHTML = new Date().toLocaleDateString("pt-BR");
    }
}

// =================================
// Carregar jogadores da planilha
// =================================
async function carregarJogadoresGols() {
    const lista = document.getElementById("listaGols");
    lista.innerHTML = "Carregando jogadores...";
    
    try {
        // Usa a mesma função já existente no api.js
        jogadoresGols = await buscarJogadores();
        lista.innerHTML = "";

        // Ordena alfabeticamente
        jogadoresGols.sort((a, b) => a.nome.localeCompare(b.nome));

        let htmlAcumulado = ""; // Otimização de performance

        jogadoresGols.forEach(jogador => {
            gols[jogador.id] = 0;

            htmlAcumulado += `
                            <div class="linhaGol">
                                <strong>${jogador.nome} - ${jogador.posicao}</strong>
                                <div class="controleGol">
                                    <button onclick="adicionarGol('${jogador.id}')">🥅⚽</button>
                                    <span id="gol-${jogador.id}">0</span>
                                    <button onclick="diminuirGol('${jogador.id}')">➖</button>
                                </div>
                            </div>
                            `;
        });

        lista.innerHTML = htmlAcumulado; // Atualiza a tela uma única vez
        atualizarRanking();

    } catch (erro) {
        console.error("Erro ao carregar jogadores:", erro);
        lista.innerHTML = "Erro ao carregar jogadores";
    }
}

// =================================
// Adicionar gol
// =================================
function adicionarGol(id) {
    // Correção do bug do valor 0 (falsy)
    if (gols[id] === undefined) {
        gols[id] = 0;
    }

    gols[id]++;
    atualizarGol(id);
    atualizarRanking();
    const botaoSalvar = document.querySelector('button[onclick="salvarGols()"]');

    if (botaoSalvar) {
        botaoSalvar.disabled = false;
        botaoSalvar.innerHTML = "💾 Salvar Resultado";
    }
}

// =================================
// Diminuir gol
// =================================
function diminuirGol(id) {
    if (gols[id] > 0) {
        gols[id]--;
    }
    atualizarGol(id);
    atualizarRanking();
}

// =================================
// Atualiza número na tela
// =================================
function atualizarGol(id) {
    const campo = document.getElementById("gol-" + id);
    if (campo) {
        campo.innerHTML = gols[id];
    }
}

// =================================
// Ranking de artilheiros
// =================================
// =================================
// Ranking Geral
// =================================

async function atualizarRanking() {

    const ranking = document.getElementById("rankingGols");

    if (!ranking) {
        return;
    }

    ranking.innerHTML = "Carregando ranking...";

    try {

        const listaRanking = await buscarRanking();

        let htmlRanking = "";

        const jogadoresComGols = listaRanking.filter(jogador => jogador.gols > 0);

        jogadoresComGols.forEach((jogador, index) => {

            htmlRanking += `
                <p>${index + 1}º ${jogador.jogador} - ⚽ ${jogador.gols}</p>
            `;

        });
        ranking.innerHTML = htmlRanking;

    } catch (erro) {

        console.error("Erro ao carregar ranking:", erro);

        ranking.innerHTML = "Erro ao carregar ranking.";

    }

}

// =================================
// Voltar para página principal
// =================================
function voltarInicio() {
    window.location.href = "index.html";
}

// =================================
// Salvar os dados na API
// =================================
function salvarGols() {

    let listaGols = [];

    jogadoresGols.forEach(jogador => {

        listaGols.push({

            nome: jogador.nome,
            gols: gols[jogador.id] || 0

        });

    });

    const dados = {

        action: "salvarGols",
        gols: listaGols

    };

    const botaoSalvar = document.querySelector('button[onclick="salvarGols()"]');

    botaoSalvar.disabled = true;
    botaoSalvar.innerHTML = "⏳ Salvando...";

    enviarDados(dados)

        .then(resposta => {

            if (resposta && resposta.sucesso) {

                atualizarRanking();

                botaoSalvar.innerHTML = "✅ Resultado Salvo";

                alert("✅ Gols salvos com sucesso!");

            } else {

                botaoSalvar.disabled = false;

                botaoSalvar.innerHTML = "💾 Salvar Resultado";

                alert("❌ Erro ao salvar gols.");

            }

        })

        .catch(erro => {

            console.error(erro);

            botaoSalvar.disabled = false;

            botaoSalvar.innerHTML = "💾 Salvar Resultado";

            alert("Erro de comunicação.");

        });

}

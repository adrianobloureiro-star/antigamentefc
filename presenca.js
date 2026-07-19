// ======================================
// LISTA DE PRESENÇA ONLINE
// presenca.js
// ======================================


// ===============================
// Atualizar data
// ===============================

function atualizarData(){

    const hoje = new Date();

    document.getElementById("data").innerHTML =
        "📅 " + hoje.toLocaleDateString("pt-BR");

}



// ===============================
// Atualizar hora
// ===============================

function atualizarHora(){

    const agora = new Date();

    document.getElementById("hora").innerHTML =
        "🕒 " + agora.toLocaleTimeString("pt-BR");

}



// ===============================
// Registrar presença
// ===============================

async function registrarPresenca(){


    if(sessionStorage.getItem("presencaRegistrada") === "true"){

        alert("Presença já registrada nesta sessão.");

        return;

    }


    const nome = document
        .getElementById("nome")
        .value
        .trim();



    if(nome === ""){

        alert("Digite seu nome");

        return;

    }



    const retorno = await registrarPresencaAPI(nome);



    if(retorno.sucesso){


        alert("Presença registrada com sucesso!");


        sessionStorage.setItem("presencaRegistrada", "true");


        const botao = document.getElementById("btnRegistrarPresenca");


        if(botao){

            botao.disabled = true;

            botao.innerHTML = "✅ Presença já registrada";

        }


        document.getElementById("nome").value = "";


        carregarPresenca();


    }else{


        alert("Erro ao registrar presença");


    }



}



// ===============================
// Carregar lista de presentes
// ===============================

async function carregarPresenca(){

    const lista = await buscarPresencaHoje();


    console.log("RETORNO DA API:", JSON.stringify(lista));


    const div = document.getElementById("listaPresenca");

    div.innerHTML = "";


    lista.forEach(pessoa => {


        div.innerHTML += `

            <p>
            ✅ ${pessoa.nome} - ${pessoa.hora}
            </p>

        `;


    });

}



// ===============================
// Inicialização
// ===============================

document.addEventListener("DOMContentLoaded",function(){


    atualizarData();


    atualizarHora();


    setInterval(atualizarHora,1000);


    carregarPresenca();



    const botao = document.getElementById("btnRegistrarPresenca");


    if(sessionStorage.getItem("presencaRegistrada") === "true" && botao){


        botao.disabled = true;

        botao.innerHTML = "✅ Presença já registrada";


    }


});
/////////////////////////////// DATA HORA SAÍDA ///////////////////////////////

function validarDataHoraSaida(dataHoraString) {
    const $data_hora_saida = document.querySelector('#data_hora_saida');

    if (dataHoraString.trim() === '') {
        $data_hora_saida.setCustomValidity('');
        return true;
    }

    const partesDataHora = dataHoraString.split(' ');
    if (partesDataHora.length !== 2) {
        mensagemAlertaDataHoraSaida();
        return false;
    }

    const dataString = partesDataHora[0];
    const horaMinutoString = partesDataHora[1];

    // Validação da data
    const partesData = dataString.split('/');
    if (partesData.length !== 3) {
        mensagemAlertaDataHoraSaida();
        return false;
    }

    const dia = parseInt(partesData[0], 10);
    const mes = parseInt(partesData[1], 10) - 1;
    const ano = parseInt(partesData[2], 10);

    // Validação da hora e minuto
    const partesHoraMinuto = horaMinutoString.split(':');
    if (partesHoraMinuto.length !== 2) {
        mensagemAlertaDataHoraSaida();
        return false;
    }

    const hora = parseInt(partesHoraMinuto[0], 10);
    const minuto = parseInt(partesHoraMinuto[1], 10);

    const data = new Date(ano, mes, dia, hora, minuto);
    const dataAtual = new Date();
    const seculoAtual = Math.floor(dataAtual.getFullYear() / 100);

    if (
        data.getDate() !== dia || 
        data.getMonth() !== mes || 
        data.getFullYear() !== ano ||
        isNaN(hora) || hora < 0 || hora > 23 ||
        isNaN(minuto) || minuto < 0 || minuto > 59
    ) {
        mensagemAlertaDataHoraSaida();
        return false;
    }

    if (data.getFullYear() < seculoAtual * 100) {
        mensagemAlertaDataSaidaSeculoPassado();
        return false;
    }
    
    // Removido: A data de saída não deve ser necessariamente no passado em um agendamento.
    // if (data > dataAtual) {
    //     mensagemAlertaDataHoraSaidaFutura();
    //     return false;
    // }

    $data_hora_saida.setCustomValidity('');
    return true;
}

document.getElementById('data_hora_saida').addEventListener('blur', function() {
    const dataHoraDigitada = this.value;
    validarDataHoraSaida(dataHoraDigitada);
    // Adicionado: Revalidar a chegada quando a saída muda
    const dataHoraChegadaDigitada = document.getElementById('data_hora_chegada').value;
    if (dataHoraChegadaDigitada) {
        validarOrdemDatas(dataHoraDigitada, dataHoraChegadaDigitada);
    }
});

// A validação no submit do formulário será consolidada ao final,
// para chamar todas as validações necessárias.


function mensagemAlertaDataHoraSaida() {
    'use strict';
    
    var $data_hora_saida = document.querySelector('#data_hora_saida');

    var errorsMessage = 'Data ou hora de saída inválida.'; // Mensagem mais específica
    $data_hora_saida.setCustomValidity(errorsMessage);
    $data_hora_saida.reportValidity();
}

// Removido: Esta validação foi removida porque a data de saída pode ser futura para agendamento.
// function mensagemAlertaDataHoraSaidaFutura() {
//     'use strict';
//
//     var $data_hora_saida = document.querySelector('#data_hora_saida');
//
//     var errorsMessage = 'Data ou hora futura.';
//     $data_hora_saida.setCustomValidity(errorsMessage);
//     $data_hora_saida.reportValidity();
// }

function mensagemAlertaDataSaidaSeculoPassado() {
    'use strict';

    var $data_hora_saida = document.querySelector('#data_hora_saida');

    var errorsMessage = 'Data do século passado.';
    $data_hora_saida.setCustomValidity(errorsMessage);
    $data_hora_saida.reportValidity();
}


/////////////////////////////// DATA HORA CHEGADA ///////////////////////////////

function validarDataHoraChegada(dataHoraString) {
    const $data_hora_chegada = document.querySelector('#data_hora_chegada');

    if (dataHoraString.trim() === '') {
        $data_hora_chegada.setCustomValidity('');
        return true;
    }

    const partesDataHora = dataHoraString.split(' ');
    if (partesDataHora.length !== 2) {
        mensagemAlertaDataHoraChegada();
        return false;
    }

    const dataString = partesDataHora[0];
    const horaMinutoString = partesDataHora[1];

    // Validação da data
    const partesData = dataString.split('/');
    if (partesData.length !== 3) {
        mensagemAlertaDataHoraChegada();
        return false;
    }

    const dia = parseInt(partesData[0], 10);
    const mes = parseInt(partesData[1], 10) - 1; 
    const ano = parseInt(partesData[2], 10);

    // Validação da hora e minuto
    const partesHoraMinuto = horaMinutoString.split(':');
    if (partesHoraMinuto.length !== 2) {
        mensagemAlertaDataHoraChegada();
        return false;
    }

    const hora = parseInt(partesHoraMinuto[0], 10);
    const minuto = parseInt(partesHoraMinuto[1], 10);

    const data = new Date(ano, mes, dia, hora, minuto);
    const dataAtual = new Date();
    const seculoAtual = Math.floor(dataAtual.getFullYear() / 100);

    if (
        data.getDate() !== dia || 
        data.getMonth() !== mes || 
        data.getFullYear() !== ano ||
        isNaN(hora) || hora < 0 || hora > 23 ||
        isNaN(minuto) || minuto < 0 || minuto > 59
    ) {
        mensagemAlertaDataHoraChegada();
        return false;
    }

    if (data.getFullYear() < seculoAtual * 100) {
        mensagemAlertaDataChegadaSeculoPassado();
        return false;
    }

    // Removido: A data de chegada não deve ser necessariamente no passado em um agendamento.
    // if (data > dataAtual) {
    //     mensagemAlertaDataHoraChegadaFutura();
    //     return false;
    // }

    $data_hora_chegada.setCustomValidity('');
    return true;
}

document.getElementById('data_hora_chegada').addEventListener('blur', function() {
    const dataHoraDigitada = this.value;
    validarDataHoraChegada(dataHoraDigitada);
    // Adicionado: Revalidar a ordem das datas quando a chegada muda
    const dataHoraSaidaDigitada = document.getElementById('data_hora_saida').value;
    if (dataHoraSaidaDigitada) {
        validarOrdemDatas(dataHoraSaidaDigitada, dataHoraDigitada);
    }
});

// A validação no submit do formulário será consolidada ao final,
// para chamar todas as validações necessárias.

function mensagemAlertaDataHoraChegada() {
    'use strict';
    
    var $data_hora_chegada = document.querySelector('#data_hora_chegada');

    var errorsMessage = 'Data ou hora de chegada inválida.'; // Mensagem mais específica
    $data_hora_chegada.setCustomValidity(errorsMessage);
    $data_hora_chegada.reportValidity();
}

// Removido: Esta validação foi removida porque a data de chegada pode ser futura para agendamento.
// function mensagemAlertaDataHoraChegadaFutura() {
//     'use strict';
//
//     var $data_hora_chegada = document.querySelector('#data_hora_chegada');
//
//     var errorsMessage = 'Data ou hora futura.';
//     $data_hora_chegada.setCustomValidity(errorsMessage);
//     $data_hora_chegada.reportValidity();
// }

function mensagemAlertaDataChegadaSeculoPassado() {
    'use strict';

    var $data_hora_chegada = document.querySelector('#data_hora_chegada');

    var errorsMessage = 'Data do século passado.';
    $data_hora_chegada.setCustomValidity(errorsMessage);
    $data_hora_chegada.reportValidity();
}

/////////////////////////////// DATA HORA IGUAIS (e ordem) ///////////////////////////////

// Função auxiliar para converter string "dd/mm/aaaa hh:mm" para objeto Date
function parseDataHoraString(dataHoraString) {
    const partesDataHora = dataHoraString.split(' ');
    const dataString = partesDataHora[0];
    const horaMinutoString = partesDataHora[1];

    const [dia, mes, ano] = dataString.split('/').map(Number);
    const [hora, minuto] = horaMinutoString.split(':').map(Number);

    // Mês é 0-indexed no JavaScript Date
    return new Date(ano, mes - 1, dia, hora, minuto);
}

// NOVA FUNÇÃO: Validar que a data/hora de chegada é posterior à data/hora de saída
function validarOrdemDatas(dataHoraSaidaString, dataHoraChegadaString) {
    const $data_hora_saida = document.querySelector('#data_hora_saida');
    const $data_hora_chegada = document.querySelector('#data_hora_chegada');

    // Se um dos campos estiver vazio, a validação de ordem não se aplica ainda
    if (dataHoraSaidaString.trim() === '' || dataHoraChegadaString.trim() === '') {
        $data_hora_saida.setCustomValidity('');
        $data_hora_chegada.setCustomValidity('');
        return true;
    }

    // Primeiro, valide os formatos individuais antes de comparar
    if (!validarDataHoraSaida(dataHoraSaidaString) || !validarDataHoraChegada(dataHoraChegadaString)) {
        return false; // Se o formato estiver errado, já falha aqui
    }

    const dataSaida = parseDataHoraString(dataHoraSaidaString);
    const dataChegada = parseDataHoraString(dataHoraChegadaString);

    if (isNaN(dataSaida.getTime()) || isNaN(dataChegada.getTime())) {
        // Se a conversão falhou, significa que o formato já estava inválido, 
        // e as funções de validação individuais já teriam disparado.
        return false; 
    }

    if (dataChegada.getTime() <= dataSaida.getTime()) {
        mensagemAlertaDataOrdemInvalida();
        return false;
    }

    $data_hora_saida.setCustomValidity('');
    $data_hora_chegada.setCustomValidity('');
    return true;
}

// O event listener para 'blur' na data_hora_chegada já foi atualizado acima
// para chamar validarOrdemDatas.


function mensagemAlertaDataIguais() {
    'use strict';

    var $data_hora_saida = document.querySelector('#data_hora_saida');
    var $data_hora_chegada = document.querySelector('#data_hora_chegada');

    var errorsMessage = 'Data e hora de saída são iguais à data e hora de chegada.';
    $data_hora_saida.setCustomValidity(errorsMessage);
    $data_hora_saida.reportValidity();

    $data_hora_chegada.setCustomValidity(errorsMessage);
    $data_hora_chegada.reportValidity();
}

// NOVA FUNÇÃO: Mensagem para ordem inválida
function mensagemAlertaDataOrdemInvalida() {
    'use strict';

    var $data_hora_saida = document.querySelector('#data_hora_saida');
    var $data_hora_chegada = document.querySelector('#data_hora_chegada');

    var errorsMessage = 'Data/Hora de chegada deve ser posterior à Data/Hora de saída.';
    $data_hora_saida.setCustomValidity(errorsMessage);
    $data_hora_saida.reportValidity();

    $data_hora_chegada.setCustomValidity(errorsMessage);
    $data_hora_chegada.reportValidity();
}


function mensagemAlertaDataDestoante() {
    'use strict';

    var $data_hora_saida = document.querySelector('#data_hora_saida');
    var $data_hora_chegada = document.querySelector('#data_hora_chegada');

    var errorsMessage = 'Data Inválida. Mais de um mês de diferença entre as datas.';
    $data_hora_saida.setCustomValidity(errorsMessage);
    $data_hora_saida.reportValidity();

    $data_hora_chegada.setCustomValidity(errorsMessage);
    $data_hora_chegada.reportValidity();
}

// CONSOLIDAÇÃO DA VALIDAÇÃO NO SUBMIT DO FORMULÁRIO
document.querySelector('form').addEventListener('submit', function(event) {
    const dataHoraSaidaDigitada = document.getElementById('data_hora_saida').value;
    const dataHoraChegadaDigitada = document.getElementById('data_hora_chegada').value;

    let formIsValid = true;

    // Valida a data de saída
    if (!validarDataHoraSaida(dataHoraSaidaDigitada)) {
        formIsValid = false;
    }

    // Valida a data de chegada
    if (!validarDataHoraChegada(dataHoraChegadaDigitada)) {
        formIsValid = false;
    }

    // Valida a ordem das datas (chegada posterior à saída)
    if (formIsValid && !validarOrdemDatas(dataHoraSaidaDigitada, dataHoraChegadaDigitada)) {
        formIsValid = false;
    }
    
    // Valida a diferença de um mês (se ainda for necessário após a validação de ordem)
    // OBS: A função `validarDataHora` que você tinha antes combinava "iguais" e "destoante".
    // A nova `validarOrdemDatas` já cuida dos "iguais" (>=).
    // Se a regra "mais de um mês de diferença" ainda for uma validação separada, 
    // ela deve ser adicionada aqui. Por enquanto, a mantive no código, mas
    // sugiro reavaliar se `validarOrdemDatas` e `mensagemAlertaDataIguais`
    // são suficientes e a `validarDataHora` original pode ser simplificada.
    if (formIsValid && !validarDataHora(dataHoraSaidaDigitada, dataHoraChegadaDigitada)) {
        formIsValid = false;
    }


    if (!formIsValid) {
        event.preventDefault(); // Impede o envio do formulário se houver erros
    }
});

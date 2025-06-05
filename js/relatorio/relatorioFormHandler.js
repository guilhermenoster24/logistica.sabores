document.addEventListener('DOMContentLoaded', function() {
    const relatorioForm = document.getElementById('relatorioForm');
    const veiculoSelect = document.getElementById('veiculo');
    const motoristaSelect = document.getElementById('motorista');
    const relatoriosRef = ref(window.database, 'relatorios');

    // Elementos de KM
    const quilometragemInicialInput = document.getElementById("quilometragemInicial");
    const quilometragemFinalInput = document.getElementById("quilometragemFinal");
    const quilometragemPercorridaInput = document.getElementById("quilometragemPercorrida");

    // Lógica para preencher selects (reutilizada de relatorioListas.js)
    const loadSelects = () => {
        const veiculosRef = ref(window.database, 'veiculos');
        const motoristasRef = ref(window.database, 'motoristas');

        onValue(veiculosRef, (snapshot) => {
            veiculoSelect.innerHTML = '<option value="">Escolha o veículo</option>';
            const veiculosData = snapshot.val();
            if (veiculosData) {
                for (let firebaseId in veiculosData) {
                    const veiculo = { id: firebaseId, ...veiculosData[firebaseId] };
                    const option = document.createElement('option');
                    option.value = veiculo.id;
                    option.textContent = `${veiculo.placa} - ${veiculo.modelo}`;
                    veiculoSelect.appendChild(option);
                }
            }
        }, { onlyOnce: true }); // Carrega apenas uma vez para edição

        onValue(motoristasRef, (snapshot) => {
            motoristaSelect.innerHTML = '<option value="">Escolha o motorista</option>';
            const motoristasData = snapshot.val();
            if (motoristasData) {
                for (let firebaseId in motoristasData) {
                    const motorista = { id: firebaseId, ...motoristasData[firebaseId] };
                    const option = document.createElement('option');
                    option.value = motorista.id;
                    option.textContent = motorista.nome;
                    motoristaSelect.appendChild(option);
                }
            }
        }, { onlyOnce: true }); // Carrega apenas uma vez para edição
    };
    loadSelects(); // Carrega os selects ao iniciar a página

    // Lógica de cálculo de quilometragem (de validaQuilometragem.js)
    quilometragemInicialInput.addEventListener("input", calcularQuilometragem);
    quilometragemFinalInput.addEventListener("blur", calcularQuilometragem);

    function calcularQuilometragem() {
        const quilometragemInicial = parseFloat(quilometragemInicialInput.value) || 0;
        const quilometragemFinal = parseFloat(quilometragemFinalInput.value) || 0;

        if (!isNaN(quilometragemInicial) && !isNaN(quilometragemFinal)) {
            const quilometragemPercorrida = quilometragemFinal - quilometragemInicial;
            quilometragemPercorridaInput.value = quilometragemPercorrida;     
            setTimeout(validaQuilometragemTotal, 1000);
        } else {
            quilometragemPercorridaInput.value = "";
        }
    }

    function validaQuilometragemTotal() {
        const quilometragemPercorrida = parseFloat(quilometragemPercorridaInput.value);

        if (quilometragemPercorrida <= 0 || isNaN(quilometragemPercorrida)) {
            mensagemAlertaQuilometragemTotal();
            return false;
        }
        quilometragemPercorridaInput.setCustomValidity('');
        return true;
    }

    function mensagemAlertaQuilometragemTotal() {
        'use strict';
        const $quilometragemPercorrida = document.querySelector('#quilometragemPercorrida');
        const errorsMessage = 'A quilometragem percorrida deve ser um número positivo e superior a zero.';
        
        $quilometragemPercorrida.removeAttribute("disabled"); // Habilita para mostrar a validação
        $quilometragemPercorrida.setCustomValidity(errorsMessage);
        $quilometragemPercorrida.reportValidity();

        setTimeout(function() {
            $quilometragemPercorrida.setAttribute("disabled", "disabled"); // Desabilita novamente
        }, 3000);
    }
    // Fim da lógica de quilometragem

    // Lógica de desabilitar/habilitar campos e carregar para edição (de editarRelatorio.js)
    const urlParams = new URLSearchParams(window.location.search);
    const relatorioFirebaseId = urlParams.get('id');

    if (relatorioFirebaseId) {
        // Desabilitar campos inicialmente (admin só pode alterar após clicar em "Alterar")
        document.getElementById("veiculo").disabled = true;
        document.getElementById("motorista").disabled = true;
        document.getElementById("data_hora_saida").disabled = true;
        document.getElementById("data_hora_chegada").disabled = true;
        document.getElementById("quilometragemInicial").disabled = true;
        document.getElementById("quilometragemFinal").disabled = true;
        document.getElementById("itinerario").disabled = true;
        document.getElementById("observacao").disabled = true; // Adicionado para desabilitar também

        document.getElementById('botaoPesquisar').style.display = 'none';
        document.getElementById('botaoExcluir').style.display = 'inline-block'; // Excluir fica visível
        document.getElementById('botaoAlterar').style.display = 'inline-block'; // Alterar fica visível
        document.getElementById('salvar').textContent = 'Atualizar';

        // Lógica de "Alterar" para habilitar campos
        document.getElementById("botaoAlterar").addEventListener("click", function() {
            document.getElementById("veiculo").disabled = false;
            document.getElementById("motorista").disabled = false;
            document.getElementById("data_hora_saida").disabled = false;
            document.getElementById("data_hora_chegada").disabled = false;
            document.getElementById("quilometragemInicial").disabled = false;
            document.getElementById("quilometragemFinal").disabled = false;
            document.getElementById("itinerario").disabled = false;
            document.getElementById("observacao").disabled = false; // Habilitar observação
        });

        // Carregar dados para edição
        const itemRef = ref(window.database, `relatorios/${relatorioFirebaseId}`);
        once(itemRef)
            .then(snapshot => {
                const relatorio = snapshot.val();
                if (relatorio) {
                    document.getElementById("veiculo").value = relatorio.idVeiculo;
                    document.getElementById("motorista").value = relatorio.idMotorista;
                    document.getElementById("rota").value = relatorio.rota;
                    document.getElementById("data_hora_saida").value = relatorio.dataHoraSaida;
                    document.getElementById("data_hora_chegada").value = relatorio.dataHoraChegada;
                    document.getElementById("quilometragemInicial").value = relatorio.quilometragemInicial;
                    document.getElementById("quilometragemFinal").value = relatorio.quilometragemFinal;
                    document.getElementById("quilometragemPercorrida").value = relatorio.quilometragemPercorrida;
                    document.getElementById("itinerario").value = relatorio.itinerario;
                    document.getElementById("observacao").value = relatorio.observacao;
                } else {
                    alert('Viagem não encontrada no Firebase.');
                    window.location.href = 'controleViagens.html';
                }
            })
            .catch(error => {
                console.error("Erro ao carregar viagem para edição: ", error);
                alert("Erro ao carregar dados da viagem.");
            });
        
        // Lógica de Exclusão (de editarRelatorio.js, adaptada para Firebase)
        document.getElementById("botaoExcluir").addEventListener("click", function(event) {
            event.preventDefault();
            if (confirm("Deseja confirmar a exclusão da viagem com ID: " + relatorioFirebaseId + "?")) {
                const itemRef = ref(window.database, `relatorios/${relatorioFirebaseId}`);
                remove(itemRef)
                    .then(() => {
                        alert("Viagem excluída com sucesso.");
                        window.location.href = "controleViagens.html";
                    })
                    .catch(error => {
                        console.error("Erro ao excluir viagem: ", error);
                        alert("Erro ao excluir viagem. Verifique o console.");
                    });
            }
        });

    } else { // Não está em modo de edição, é um novo cadastro
        document.getElementById('botaoAlterar').style.display = 'none'; // Esconde Alterar
        document.getElementById('botaoExcluir').style.display = 'none'; // Esconde Excluir
    }
    // Fim da lógica de edição/exclusão


    // Lógica de validação de Data/Hora Saída (de relatorio.js)
    function validarDataHoraSaida(dataHoraString) {
        const $data_hora_saida = document.querySelector('#data_hora_saida');
        if (dataHoraString.trim() === '') { $data_hora_saida.setCustomValidity(''); return true; }
        const partesDataHora = dataHoraString.split(' ');
        if (partesDataHora.length !== 2) { mensagemAlertaDataHoraSaida(); return false; }
        const dataString = partesDataHora[0];
        const horaMinutoString = partesDataHora[1];
        const partesData = dataString.split('/');
        if (partesData.length !== 3) { mensagemAlertaDataHoraSaida(); return false; }
        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1;
        const ano = parseInt(partesData[2], 10);
        const partesHoraMinuto = horaMinutoString.split(':');
        if (partesHoraMinuto.length !== 2) { mensagemAlertaDataHoraSaida(); return false; }
        const hora = parseInt(partesHoraMinuto[0], 10);
        const minuto = parseInt(partesHoraMinuto[1], 10);
        const data = new Date(ano, mes, dia, hora, minuto);
        const dataAtual = new Date();
        const seculoAtual = Math.floor(dataAtual.getFullYear() / 100);

        if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano ||
            isNaN(hora) || hora < 0 || hora > 23 || isNaN(minuto) || minuto < 0 || minuto > 59) {
            mensagemAlertaDataHoraSaida(); return false;
        }
        if (data.getFullYear() < seculoAtual * 100) { mensagemAlertaDataSaidaSeculoPassado(); return false; }
        $data_hora_saida.setCustomValidity(''); return true;
    }

    document.getElementById('data_hora_saida').addEventListener('blur', function() {
        const dataHoraDigitada = this.value;
        validarDataHoraSaida(dataHoraDigitada);
        const dataHoraChegadaDigitada = document.getElementById('data_hora_chegada').value;
        if (dataHoraChegadaDigitada) { validarOrdemDatas(dataHoraDigitada, dataHoraChegadaDigitada); }
    });

    function mensagemAlertaDataHoraSaida() {
        'use strict'; var $data_hora_saida = document.querySelector('#data_hora_saida');
        var errorsMessage = 'Data ou hora de saída inválida.';
        $data_hora_saida.setCustomValidity(errorsMessage); $data_hora_saida.reportValidity();
    }
    function mensagemAlertaDataSaidaSeculoPassado() {
        'use strict'; var $data_hora_saida = document.querySelector('#data_hora_saida');
        var errorsMessage = 'Data do século passado.';
        $data_hora_saida.setCustomValidity(errorsMessage); $data_hora_saida.reportValidity();
    }
    // Fim da lógica de validação de Data/Hora Saída

    // Lógica de validação de Data/Hora Chegada (de relatorio.js)
    function validarDataHoraChegada(dataHoraString) {
        const $data_hora_chegada = document.querySelector('#data_hora_chegada');
        if (dataHoraString.trim() === '') { $data_hora_chegada.setCustomValidity(''); return true; }
        const partesDataHora = dataHoraString.split(' ');
        if (partesDataHora.length !== 2) { mensagemAlertaDataHoraChegada(); return false; }
        const dataString = partesDataHora[0];
        const horaMinutoString = partesDataHora[1];
        const partesData = dataString.split('/');
        if (partesData.length !== 3) { mensagemAlertaDataHoraChegada(); return false; }
        const dia = parseInt(partesData[0], 10); const mes = parseInt(partesData[1], 10) - 1; 
        const ano = parseInt(partesData[2], 10);
        const partesHoraMinuto = horaMinutoString.split(':');
        if (partesHoraMinuto.length !== 2) { mensagemAlertaDataHoraChegada(); return false; }
        const hora = parseInt(partesHoraMinuto[0], 10); const minuto = parseInt(partesHoraMinuto[1], 10);
        const data = new Date(ano, mes, dia, hora, minuto);
        const dataAtual = new Date(); const seculoAtual = Math.floor(dataAtual.getFullYear() / 100);

        if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano ||
            isNaN(hora) || hora < 0 || hora > 23 || isNaN(minuto) || minuto < 0 || minuto > 59) {
            mensagemAlertaDataHoraChegada(); return false;
        }
        if (data.getFullYear() < seculoAtual * 100) { mensagemAlertaDataChegadaSeculoPassado(); return false; }
        $data_hora_chegada.setCustomValidity(''); return true;
    }

    document.getElementById('data_hora_chegada').addEventListener('blur', function() {
        const dataHoraDigitada = this.value;
        validarDataHoraChegada(dataHoraDigitada);
        const dataHoraSaidaDigitada = document.getElementById('data_hora_saida').value;
        if (dataHoraSaidaDigitada) { validarOrdemDatas(dataHoraSaidaDigitada, dataHoraDigitada); }
    });

    function mensagemAlertaDataHoraChegada() {
        'use strict'; var $data_hora_chegada = document.querySelector('#data_hora_chegada');
        var errorsMessage = 'Data ou hora de chegada inválida.';
        $data_hora_chegada.setCustomValidity(errorsMessage); $data_hora_chegada.reportValidity();
    }
    function mensagemAlertaDataChegadaSeculoPassado() {
        'use strict'; var $data_hora_chegada = document.querySelector('#data_hora_chegada');
        var errorsMessage = 'Data do século passado.';
        $data_hora_chegada.setCustomValidity(errorsMessage); $data_hora_chegada.reportValidity();
    }
    // Fim da lógica de validação de Data/Hora Chegada

    // Lógica de validação de Ordem das Datas (de relatorio.js)
    function parseDataHoraString(dataHoraString) {
        const partesDataHora = dataHoraString.split(' ');
        const dataString = partesDataHora[0];
        const horaMinutoString = partesDataHora[1];
        const [dia, mes, ano] = dataString.split('/').map(Number);
        const [hora, minuto] = horaMinutoString.split(':').map(Number);
        return new Date(ano, mes - 1, dia, hora, minuto);
    }

    function validarOrdemDatas(dataHoraSaidaString, dataHoraChegadaString) {
        const $data_hora_saida = document.querySelector('#data_hora_saida');
        const $data_hora_chegada = document.querySelector('#data_hora_chegada');

        if (dataHoraSaidaString.trim() === '' || dataHoraChegadaString.trim() === '') {
            $data_hora_saida.setCustomValidity(''); $data_hora_chegada.setCustomValidity(''); return true;
        }

        if (!validarDataHoraSaida(dataHoraSaidaString) || !validarDataHoraChegada(dataHoraChegadaString)) { return false; }

        const dataSaida = parseDataHoraString(dataHoraSaidaString);
        const dataChegada = parseDataHoraString(dataHoraChegadaString);

        if (isNaN(dataSaida.getTime()) || isNaN(dataChegada.getTime())) { return false; }

        if (dataChegada.getTime() <= dataSaida.getTime()) { mensagemAlertaDataOrdemInvalida(); return false; }

        $data_hora_saida.setCustomValidity(''); $data_hora_chegada.setCustomValidity(''); return true;
    }

    function mensagemAlertaDataOrdemInvalida() {
        'use strict'; var $data_hora_saida = document.querySelector('#data_hora_saida');
        var $data_hora_chegada = document.querySelector('#data_hora_chegada');
        var errorsMessage = 'Data/Hora de chegada deve ser posterior à Data/Hora de saída.';
        $data_hora_saida.setCustomValidity(errorsMessage); $data_hora_saida.reportValidity();
        $data_hora_chegada.setCustomValidity(errorsMessage); $data_hora_chegada.reportValidity();
    }

    function mensagemAlertaDataDestoante() {
        'use strict'; var $data_hora_saida = document.querySelector('#data_hora_saida');
        var $data_hora_chegada = document.querySelector('#data_hora_chegada');
        var errorsMessage = 'Data Inválida. Mais de um mês de diferença entre as datas.';
        $data_hora_saida.setCustomValidity(errorsMessage); $data_hora_saida.reportValidity();
        $data_hora_chegada.setCustomValidity(errorsMessage); $data_hora_chegada.reportValidity();
    }
    // Fim da lógica de validação de Ordem das Datas

    // Consolidação da validação e submissão do formulário (de validarFormularioRelatorio.js e relatorio.js)
    relatorioForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        let formIsValid = true;

        // 1. Validar campos individualmente e com as funções de validação
        if (!veiculoSelect.value) { formIsValid = false; veiculoSelect.setCustomValidity('Selecione um veículo.'); veiculoSelect.reportValidity(); } else { veiculoSelect.setCustomValidity(''); }
        if (!motoristaSelect.value) { formIsValid = false; motoristaSelect.setCustomValidity('Selecione um motorista.'); motoristaSelect.reportValidity(); } else { motoristaSelect.setCustomValidity(''); }
        
        if (!validarDataHoraSaida(document.getElementById('data_hora_saida').value)) { formIsValid = false; }
        if (!validarDataHoraChegada(document.getElementById('data_hora_chegada').value)) { formIsValid = false; }
        if (!validarOrdemDatas(document.getElementById('data_hora_saida').value, document.getElementById('data_hora_chegada').value)) { formIsValid = false; }
        // Chamada da função que você tinha para diferença de meses. Reavalie se é necessária
        // if (!validarDataHora(document.getElementById('data_hora_saida').value, document.getElementById('data_hora_chegada').value)) { formIsValid = false; }

        if (!document.getElementById('rota').value.trim()) { formIsValid = false; document.getElementById('rota').setCustomValidity('Informe a rota.'); document.getElementById('rota').reportValidity(); } else { document.getElementById('rota').setCustomValidity(''); }
        if (!document.getElementById('itinerario').value.trim()) { formIsValid = false; document.getElementById('itinerario').setCustomValidity('Informe o itinerário.'); document.getElementById('itinerario').reportValidity(); } else { document.getElementById('itinerario').setCustomValidity(''); }

        // Validação de Quilometragem (se não estiver disabled)
        if (!quilometragemInicialInput.disabled && !validaQuilometragemTotal()) { // Valida KM se for campo editável pelo admin
            formIsValid = false;
        }

        // 2. Verifica a validade do formulário HTML5 (para campos 'required' e 'type=email' etc.)
        if (!this.checkValidity()) {
            formIsValid = false;
        }

        // Se o formulário não é válido, para por aqui
        if (!formIsValid) {
            return; // Sai da função, impedindo o salvamento
        }

        // Se o formulário é válido, procede com o salvamento/atualização no Firebase
        const selectedVeiculoOption = veiculoSelect.options[veiculoSelect.selectedIndex];
        const selectedMotoristaOption = motoristaSelect.options[motoristaSelect.selectedIndex];

        const relatorioData = {
            idVeiculo: selectedVeiculoOption.value,
            nomeVeiculo: selectedVeiculoOption.textContent,
            idMotorista: selectedMotoristaOption.value,
            nomeMotorista: selectedMotoristaOption.textContent,
            rota: document.getElementById('rota').value,
            dataHoraSaida: document.getElementById('data_hora_saida').value,
            dataHoraChegada: document.getElementById('data_hora_chegada').value,
            quilometragemInicial: quilometragemInicialInput.value,
            quilometragemFinal: quilometragemFinalInput.value,
            quilometragemPercorrida: quilometragemPercorridaInput.value,
            itinerario: document.getElementById('itinerario').value,
            observacao: document.getElementById('observacao').value,
            status: 'Pendente' // Status inicial (será atualizado pelo motorista)
        };

        if (relatorioFirebaseId) {
            // Modo de Edição: Atualizar
            const itemRef = ref(window.database, `relatorios/${relatorioFirebaseId}`);
            
            // Antes de atualizar, recupere o status original para não sobrescrever
            once(itemRef).then(snapshot => {
                const originalRelatorio = snapshot.val();
                relatorioData.status = originalRelatorio.status || 'Pendente'; // Mantém o status existente

                return update(itemRef, relatorioData);
            })
            .then(() => {
                alert('Viagem atualizada com sucesso no Firebase!');
                window.location.href = 'controleViagens.html';
            })
            .catch(error => {
                console.error("Erro ao atualizar viagem no Firebase: ", error);
                alert('Erro ao atualizar viagem. Verifique o console.');
            });
        } else {
            // Modo de Cadastro: Salvar
            push(relatoriosRef, relatorioData)
                .then(() => {
                    alert('Viagem cadastrada com sucesso no Firebase!');
                    relatorioForm.reset();
                    // Limpa os campos de KM também
                    quilometragemInicialInput.value = '';
                    quilometragemFinalInput.value = '';
                    quilometragemPercorridaInput.value = '';

                    // Gerar PDF (opcional, aqui é gerado após o cadastro)
                    // Para gerar o PDF com o ID do Firebase, você precisaria do ID retornado pelo push()
                    // Exemplo:
                    // const newRelatorioKey = newRef.key; // Se push() retorna a referência
                    // gerarPDFRelatorio({ id: newRelatorioKey, ...relatorioData });
                })
                .catch(error => {
                    console.error("Erro ao cadastrar viagem no Firebase: ", error);
                    alert('Erro ao cadastrar viagem. Verifique o console para mais detalhes.');
                });
        }
    });

    // Função gerarPDF() (do validarFormularioRelatorio.js) - Adaptada para ser chamada manualmente se necessário
    // OBS: O PDF gerado aqui não terá o ID do Firebase se for um novo cadastro
    // Se precisar do ID, a geração de PDF deve ser feita após o push (capturando o ID retornado pela promise)
    // ou de uma tela de controle de viagens.
    window.gerarPDF = function() { // Tornando global para ser chamada externamente se necessário
        var veiculo = document.getElementById('veiculo').value;
        var motorista = document.getElementById('motorista').value;
        var rota = document.getElementById('rota').value; // Novo
        var dataHoraSaida = document.getElementById('data_hora_saida').value;
        var dataHoraChegada = document.getElementById('data_hora_chegada').value;
        var quilometragemInicial = document.getElementById('quilometragemInicial').value;
        var quilometragemFinal = document.getElementById('quilometragemFinal').value;
        var quilometragemPercorrida = document.getElementById('quilometragemPercorrida').value;
        var itinerario = document.getElementById('itinerario').value;
        var observacao = document.getElementById('observacao').value;

        var content = `
            <h1 style="font-size: 30px; text-align: center;">Informações da Viagem</h1><br><br>
            <p><strong>Veículo:</strong> ${veiculo}</p><br>
            <p><strong>Motorista:</strong> ${motorista}</p><br>
            <p><strong>Rota:</strong> ${rota}</p><br> <p><strong>Data e Hora de Saída:</strong> ${dataHoraSaida}</p><br>
            <p><strong>Data e Hora de Chegada:</strong> ${dataHoraChegada}</p><br>
            <p><strong>Quilometragem Inicial:</strong> ${quilometragemInicial} Km</p><br>
            <p><strong>Quilometragem Final:</strong> ${quilometragemFinal} Km</p><br>
            <p><strong>Quilometragem Percorrida:</strong> ${quilometragemPercorrida} Km</p><br>
            <p><strong>Itinerário:</strong> ${itinerario}</p><br>
            <p style="white-space: pre-line;"><strong>Observação:</strong> ${observacao}</p>
        `;

        var currentDate = new Date();
        var day = String(currentDate.getDate()).padStart(2, '0');
        var month = String(currentDate.getMonth() + 1).padStart(2, '0');
        var year = currentDate.getFullYear();
        var formattedDate = day + "-" + month + "-" + year;

        var opt = {
            margin: 1,
            filename: 'registro-viagem-' + formattedDate + '.pdf', // Nome do arquivo mais genérico
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(content).set(opt).save();
    };

    // A função 'limparCampos' agora é redundante para o submit, pois o reset do formulário já faz isso.
    // Mas pode ser mantida se for chamada por outros lugares.
    // function limparCampos() { /* ... */ } 
});

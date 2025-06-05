document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const veiculoFirebaseId = urlParams.get('id');

    const veiculoForm = document.getElementById('veiculoForm');
    const veiculosRef = ref(window.database, 'veiculos');

    if (veiculoFirebaseId) {
        document.getElementById('botaoPesquisar').style.display = 'none';
        document.getElementById('botaoAlterar').style.display = 'none';
        document.getElementById('botaoExcluir').style.display = 'none';
        document.getElementById('salvar').textContent = 'Atualizar'; 

        const itemRef = ref(window.database, `veiculos/${veiculoFirebaseId}`);
        once(itemRef)
            .then(snapshot => {
                const veiculo = snapshot.val();
                if (veiculo) {
                    document.getElementById('placa').value = veiculo.placa;
                    document.getElementById('marca').value = veiculo.marca;
                    document.getElementById('modelo').value = veiculo.modelo;
                    document.getElementById('ano_fabricacao').value = veiculo.anoFabricacao;
                    document.getElementById('cor').value = veiculo.cor;
                    document.getElementById('data_aquisicao').value = veiculo.dataAquisicao;
                    document.getElementById('licenciamento').value = veiculo.licenciamento;
                    document.getElementById('renavam').value = veiculo.renavam;
                    document.getElementById('km_inicial').value = veiculo.kmInicial;
                    document.getElementById('categoriaVeiculo').value = veiculo.categoriaVeiculo;
                    document.getElementById('tipoCombustivel').value = veiculo.tipoCombustivel;
                } else {
                    alert('Veículo não encontrado no Firebase.');
                    window.location.href = 'controleVeiculos.html';
                }
            })
            .catch(error => {
                console.error("Erro ao carregar veículo para edição: ", error);
                alert("Erro ao carregar dados do veículo.");
            });
    }

    veiculoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!veiculoForm.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const updatedVeiculo = {
            placa: document.getElementById('placa').value,
            marca: document.getElementById('marca').value,
            modelo: document.getElementById('modelo').value,
            anoFabricacao: document.getElementById('ano_fabricacao').value,
            cor: document.getElementById('cor').value,
            dataAquisicao: document.getElementById('data_aquisicao').value,
            licenciamento: document.getElementById('licenciamento').value,
            renavam: document.getElementById('renavam').value,
            kmInicial: document.getElementById('km_inicial').value,
            categoriaVeiculo: document.getElementById('categoriaVeiculo').value,
            tipoCombustivel: document.getElementById('tipoCombustivel').value
        };

        if (veiculoFirebaseId) {
            const itemRef = ref(window.database, `veiculos/${veiculoFirebaseId}`);

            let placaDuplicated = false;
            let renavamDuplicated = false;

            query(veiculosRef, orderByChild('placa'), equalTo(updatedVeiculo.placa)).once('value')
                .then(snapshot => {
                    snapshot.forEach(childSnapshot => {
                        if (childSnapshot.key !== veiculoFirebaseId) {
                            placaDuplicated = true;
                        }
                    });
                    return query(veiculosRef, orderByChild('renavam'), equalTo(updatedVeiculo.renavam)).once('value');
                })
                .then(snapshot => {
                    snapshot.forEach(childSnapshot => {
                        if (childSnapshot.key !== veiculoFirebaseId) {
                            renavamDuplicated = true;
                        }
                    });

                    if (placaDuplicated) {
                        alert('Erro: Já existe outro veículo com esta Placa.');
                        return Promise.reject('Placa duplicada');
                    }
                    if (renavamDuplicated) {
                        alert('Erro: Já existe outro veículo com este RENAVAM.');
                        return Promise.reject('RENAVAM duplicado');
                    }

                    return update(itemRef, updatedVeiculo);
                })
                .then(() => {
                    alert('Veículo atualizado com sucesso no Firebase!');
                    window.location.href = 'controleVeiculos.html';
                })
                .catch(error => {
                    if (error !== 'Placa duplicada' && error !== 'RENAVAM duplicado') {
                        console.error("Erro ao atualizar veículo no Firebase: ", error);
                        alert('Erro ao atualizar veículo. Verifique o console.');
                    }
                });

        } else {
            alert("Erro: Este script é para edição. Use a tela de cadastro para novos veículos.");
        }
    });
});

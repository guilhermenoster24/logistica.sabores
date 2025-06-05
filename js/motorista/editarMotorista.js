document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const motoristaFirebaseId = urlParams.get('id');

    const motoristaForm = document.getElementById('motoristaForm');
    const motoristasRef = ref(window.database, 'motoristas');

    if (motoristaFirebaseId) {
        document.getElementById('botaoPesquisar').style.display = 'none';
        document.getElementById('botaoAlterar').style.display = 'none';
        document.getElementById('botaoExcluir').style.display = 'none';
        document.getElementById('salvar').textContent = 'Atualizar'; 

        const itemRef = ref(window.database, `motoristas/${motoristaFirebaseId}`);
        once(itemRef)
            .then(snapshot => {
                const motorista = snapshot.val();
                if (motorista) {
                    document.getElementById('nome').value = motorista.nome;
                    document.getElementById('email').value = motorista.email;
                    document.getElementById('data_nascimento').value = motorista.dataNascimento;
                    document.getElementById('phone').value = motorista.telefone;
                    document.getElementById('rg').value = motorista.rg;
                    document.getElementById('cpf').value = motorista.cpf;
                    document.getElementById('senhaMotorista').value = motorista.senha;
                    document.getElementById('numero_registro').value = motorista.numeroRegistro;
                    document.getElementById('categoria').value = motorista.categoria;
                    document.getElementById('data_validade').value = motorista.dataValidade;
                    document.getElementById('data_emissao').value = motorista.dataEmissao;
                } else {
                    alert('Motorista não encontrado no Firebase.');
                    window.location.href = 'controleMotoristas.html';
                }
            })
            .catch(error => {
                console.error("Erro ao carregar motorista para edição: ", error);
                alert("Erro ao carregar dados do motorista.");
            });
    }

    motoristaForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!motoristaForm.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const updatedMotorista = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            dataNascimento: document.getElementById('data_nascimento').value,
            telefone: document.getElementById('phone').value,
            rg: document.getElementById('rg').value,
            cpf: document.getElementById('cpf').value,
            senha: document.getElementById('senhaMotorista').value,
            numeroRegistro: document.getElementById('numero_registro').value,
            categoria: document.getElementById('categoria').value,
            dataValidade: document.getElementById('data_validade').value,
            dataEmissao: document.getElementById('data_emissao').value
        };

        if (motoristaFirebaseId) {
            const itemRef = ref(window.database, `motoristas/${motoristaFirebaseId}`);

            let cpfDuplicated = false;
            let rgDuplicated = false;

            query(motoristasRef, orderByChild('cpf'), equalTo(updatedMotorista.cpf)).once('value')
                .then(snapshot => {
                    snapshot.forEach(childSnapshot => {
                        if (childSnapshot.key !== motoristaFirebaseId) {
                            cpfDuplicated = true;
                        }
                    });
                    return query(motoristasRef, orderByChild('rg'), equalTo(updatedMotorista.rg)).once('value');
                })
                .then(snapshot => {
                    snapshot.forEach(childSnapshot => {
                        if (childSnapshot.key !== motoristaFirebaseId) {
                            rgDuplicated = true;
                        }
                    });

                    if (cpfDuplicated) {
                        alert('Erro: Já existe outro motorista com este CPF.');
                        return Promise.reject('CPF duplicado');
                    }
                    if (rgDuplicated) {
                        alert('Erro: Já existe outro motorista com este RG.');
                        return Promise.reject('RG duplicado');
                    }

                    return update(itemRef, updatedMotorista);
                })
                .then(() => {
                    alert('Motorista atualizado com sucesso no Firebase!');
                    window.location.href = 'controleMotoristas.html';
                })
                .catch(error => {
                    if (error !== 'CPF duplicado' && error !== 'RG duplicado') {
                        console.error("Erro ao atualizar motorista no Firebase: ", error);
                        alert('Erro ao atualizar motorista. Verifique o console.');
                    }
                });
        } else {
            alert("Erro: Este script é para edição. Use a tela de cadastro para novos motoristas.");
        }
    });
});

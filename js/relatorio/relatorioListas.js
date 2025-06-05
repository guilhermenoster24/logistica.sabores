document.addEventListener('DOMContentLoaded', function() {
    const veiculoSelect = document.getElementById('veiculo');
    const motoristaSelect = document.getElementById('motorista');

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
    }, (error) => {
        console.error("Erro ao carregar veículos para o select: ", error);
    });

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
    }, (error) => {
        console.error("Erro ao carregar motoristas para o select: ", error);
    });
});

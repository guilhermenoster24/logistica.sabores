document.addEventListener('DOMContentLoaded', function() {

    const tableBody = document.getElementById('tableBody');



    loadRelatorios();



    function loadRelatorios() {

        const relatorios = JSON.parse(localStorage.getItem('relatorios')) || [];

        tableBody.innerHTML = ''; // Limpa a tabela



        relatorios.forEach(relatorio => {

            const row = tableBody.insertRow();

            row.insertCell().textContent = relatorio.id;

            row.insertCell().textContent = relatorio.nomeVeiculo;

            row.insertCell().textContent = relatorio.nomeMotorista;

            row.insertCell().textContent = relatorio.rota; // Nova célula para Rota

            row.insertCell().textContent = relatorio.dataHoraSaida;

            row.insertCell().textContent = relatorio.dataHoraChegada;

            row.insertCell().textContent = relatorio.quilometragemInicial || '-'; // Exibe KM inicial ou '-'

            row.insertCell().textContent = relatorio.quilometragemFinal || '-'; // Exibe KM final ou '-'

            row.insertCell().textContent = relatorio.quilometragemPercorrida || '-'; // Exibe KM total ou '-'

            row.insertCell().textContent = relatorio.status; // Nova célula para Status



            const editCell = row.insertCell();

            const editButton = document.createElement('button');

            editButton.innerHTML = '<i class="bi bi-pencil-square"></i>'; // Ícone de editar

            editButton.classList.add('edit-button');

            editButton.title = 'Editar';

            editButton.onclick = () => editRelatorio(relatorio.id);

            editCell.appendChild(editButton);



            const deleteCell = row.insertCell();

            const deleteButton = document.createElement('button');

            deleteButton.innerHTML = '<i class="bi bi-trash"></i>'; // Ícone de excluir

            deleteButton.classList.add('delete-button');

            deleteButton.title = 'Excluir';

            deleteButton.onclick = () => deleteRelatorio(relatorio.id);

            deleteCell.appendChild(deleteButton);

        });

    }



    function editRelatorio(id) {

        // Redireciona para a página de cadastro/edição com o ID do relatório

        window.location.href = `relatorio.html?id=${id}`;

    }



    function deleteRelatorio(id) {

        if (confirm(`Tem certeza que deseja excluir o relatório ID ${id}?`)) {

            let relatorios = JSON.parse(localStorage.getItem('relatorios')) || [];

            relatorios = relatorios.filter(relatorio => relatorio.id !== id);

            localStorage.setItem('relatorios', JSON.stringify(relatorios));

            alert('Relatório excluído com sucesso!');

            loadRelatorios(); // Recarrega a tabela

        }

    }

});

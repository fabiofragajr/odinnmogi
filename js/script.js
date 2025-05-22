// Variáveis globais
let beerList = [];
let sortDirection = 'asc'; // 'asc' para crescente, 'desc' para decrescente

// Função para adicionar uma nova cerveja à lista
function addBeer() {
    const beerName = document.getElementById('beer-name').value.trim();
    const beerQuantity = parseFloat(document.getElementById('beer-quantity').value);
    const beerPrice = parseFloat(document.getElementById('beer-price').value);
    
    // Validação dos campos
    if (!beerName) {
        showAlert('Por favor, informe a marca da cerveja.');
        return;
    }
    
    if (isNaN(beerQuantity) || beerQuantity <= 0) {
        showAlert('Por favor, informe uma quantidade válida em mL.');
        return;
    }
    
    if (isNaN(beerPrice) || beerPrice <= 0) {
        showAlert('Por favor, informe um valor válido em reais.');
        return;
    }
    
    // Cálculo do preço por litro
    const pricePerLiter = (beerPrice / beerQuantity) * 1000;
    
    // Adiciona a cerveja à lista
    const newBeer = {
        name: beerName,
        quantity: beerQuantity,
        price: beerPrice,
        pricePerLiter: pricePerLiter
    };
    
    beerList.push(newBeer);
    
    // Limpa os campos do formulário
    document.getElementById('beer-name').value = '';
    document.getElementById('beer-quantity').value = '';
    document.getElementById('beer-price').value = '';
    
    // Atualiza o ranking
    updateRanking();
    
    // Foca no campo de nome para facilitar a adição de uma nova cerveja
    document.getElementById('beer-name').focus();
    
    // Mostra uma mensagem de sucesso com animação
    showSuccess(`${beerName} adicionada com sucesso!`);
}

// Função para atualizar o ranking
function updateRanking() {
    const rankingBody = document.getElementById('ranking-body');
    const emptyRanking = document.getElementById('empty-ranking');
    
    // Limpa o conteúdo atual da tabela
    rankingBody.innerHTML = '';
    
    // Verifica se há cervejas na lista
    if (beerList.length === 0) {
        // Mostra a mensagem de ranking vazio
        emptyRanking.style.display = 'block';
        return;
    }
    
    // Esconde a mensagem de ranking vazio
    emptyRanking.style.display = 'none';
    
    // Ordena a lista de cervejas pelo preço por litro
    const sortedList = [...beerList].sort((a, b) => {
        return sortDirection === 'asc' 
            ? a.pricePerLiter - b.pricePerLiter 
            : b.pricePerLiter - a.pricePerLiter;
    });
    
    // Adiciona cada cerveja à tabela
    sortedList.forEach((beer, index) => {
        const row = document.createElement('tr');
        
        // Adiciona a classe 'best-value' à cerveja com melhor custo-benefício
        if (sortDirection === 'asc' && index === 0) {
            row.classList.add('best-value');
        }
        
        row.innerHTML = `
            <td>${beer.name}</td>
            <td>${beer.quantity} mL</td>
            <td>R$ ${beer.pricePerLiter.toFixed(2)}</td>
            <td>R$ ${beer.price.toFixed(2)}</td>
            <td>
                <button class="btn-delete" onclick="removeBeer(${beerList.indexOf(beer)})">
                   <i class="fas fa-trash"></i>
            </button>
            </td>
`          ;

        
        rankingBody.appendChild(row);
    });
}

// Função para remover uma cerveja da lista
function removeBeer(index) {
    if (index >= 0 && index < beerList.length) {
        const removedBeer = beerList[index];
        beerList.splice(index, 1);
        updateRanking();
        showAlert(`${removedBeer.name} removida do ranking.`);
    }
}

// Função para alternar a direção de ordenação
function toggleSortDirection() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    const sortButton = document.getElementById('sort-button');
    
    if (sortDirection === 'asc') {
        sortButton.innerHTML = '<i class="fas fa-sort-amount-down-alt"></i> Melhor Custo-Benefício';
    } else {
        sortButton.innerHTML = '<i class="fas fa-sort-amount-up"></i> Maior Preço';
    }
    
    updateRanking();
}

// Função para limpar todo o ranking
function clearRanking() {
    if (beerList.length === 0) {
        showAlert('O ranking já está vazio.');
        return;
    }
    
    if (confirm('Tem certeza que deseja limpar todo o ranking?')) {
        beerList = [];
        updateRanking();
        showAlert('Ranking limpo com sucesso.');
    }
}

// Função para mostrar alertas
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert';
    alertBox.textContent = message;
    
    document.body.appendChild(alertBox);
    
    // Adiciona a classe para mostrar o alerta com animação
    setTimeout(() => {
        alertBox.classList.add('show');
    }, 10);
    
    // Remove o alerta após 3 segundos
    setTimeout(() => {
        alertBox.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 300);
    }, 3000);
}

// Função para mostrar mensagens de sucesso
function showSuccess(message) {
    const successBox = document.createElement('div');
    successBox.className = 'success';
    successBox.textContent = message;
    
    document.body.appendChild(successBox);
    
    // Adiciona a classe para mostrar a mensagem com animação
    setTimeout(() => {
        successBox.classList.add('show');
    }, 10);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        successBox.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(successBox);
        }, 300);
    }, 3000);
}

// Inicializa o ranking quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Configura o botão de adicionar
    document.getElementById('add-beer-btn').addEventListener('click', addBeer);
    
    // Configura o botão de alternar ordenação
    document.getElementById('sort-button').addEventListener('click', toggleSortDirection);
    
    // Configura o botão de limpar ranking
    document.getElementById('clear-button').addEventListener('click', clearRanking);
    
    // Configura o envio do formulário
    document.getElementById('beer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addBeer();
    });
    
    // Inicializa o ranking vazio
    updateRanking();
    
    // Adiciona animações aos elementos da página
    document.querySelectorAll('.fade-in').forEach(element => {
        element.classList.add('show');
    });
});

// Função para validar entrada numérica
function validateNumericInput(input) {
    input.value = input.value.replace(/[^0-9.,]/g, '');
    input.value = input.value.replace(/,/g, '.');
    
    // Garante que só haja um ponto decimal
    const parts = input.value.split('.');
    if (parts.length > 2) {
        input.value = parts[0] + '.' + parts.slice(1).join('');
    }
}

// La función original que renderiza todo el inventario por primera vez
function renderInventory() {
    const inventoryContainer = document.getElementById('inventoryContainer');
    inventoryContainer.innerHTML = ''; // Limpiamos el contenedor

    fetch('api.php?action=get')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const inventory = data.items;
            if (inventory.length === 0) {
                inventoryContainer.innerHTML = '<p class="empty-message">Tu inventario está vacío. ¡Compra algunos skebops!</p>';
                return;
            }

            inventory.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('producto');
                // Asignamos un ID único a cada item para poder actualizarlo después
                itemDiv.dataset.itemId = item.id;
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="Imagen de ${item.name}">
                    <div class="producto-info">
                        <h3>${item.name}</h3>
                        <p class="precio">$${parseFloat(item.price).toFixed(2)}</p>
                        <p class="income-text">Ganancia: <span class="income-value">$${parseFloat(item.generated_income).toFixed(2)}</span> <small>(${parseFloat(item.earning_rate).toFixed(2)}$/s)</small></p>
                    </div>
                `;
                inventoryContainer.appendChild(itemDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
            inventoryContainer.innerHTML = '<p class="empty-message">Error al cargar el inventario. Asegúrate de haber iniciado sesión.</p>';
        });
}

// Nueva función para actualizar solo los precios
function updateIncome() {
    fetch('api.php?action=get')
        .then(response => response.json())
        .then(data => {
            const inventory = data.items;
            inventory.forEach(item => {
                const incomeElement = document.querySelector(`[data-item-id="${item.id}"] .income-value`);
                if (incomeElement) {
                    // Solo actualizamos el valor de la ganancia si el elemento existe
                    incomeElement.textContent = `$${parseFloat(item.generated_income).toFixed(2)}`;
                }
            });
        })
        .catch(error => {
            console.error('Error updating income:', error);
        });
}


// Llamamos a la función de renderizado inicial al cargar la página
window.onload = () => {
    renderInventory();
    // Y luego, cada segundo, llamamos a la función que solo actualiza las ganancias
    setInterval(updateIncome, 1000); 
};
// Elimina la lógica de localStorage
// let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        
function renderInventory() {
    const inventoryContainer = document.getElementById('inventoryContainer');
    inventoryContainer.innerHTML = '';

    // Obtiene el inventario desde el servidor
    fetch('api.php?action=get')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(inventory => {
            if (inventory.length === 0) {
                inventoryContainer.innerHTML = '<p class="empty-message">Tu inventario está vacío. ¡Compra algunos skebops!</p>';
                return;
            }

            inventory.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('producto');
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="Imagen de ${item.name}">
                    <div class="producto-info">
                        <h3>${item.name}</h3>
                        <p class="precio">$${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                `;
                inventoryContainer.appendChild(itemDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
            inventoryContainer.innerHTML = '<p class="empty-message">Error al cargar el inventario.</p>';
        });
}

// Llama a la función al cargar la página
window.onload = renderInventory;
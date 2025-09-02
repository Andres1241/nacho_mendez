document.addEventListener('DOMContentLoaded', () => {
    fetchRanking();
});

function fetchRanking() {
    fetch('api.php?action=get_top_users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const rankingContainer = document.getElementById('rankingContainer');
            rankingContainer.innerHTML = ''; // Limpiamos el contenedor

            if (data.top_users && data.top_users.length > 0) {
                data.top_users.forEach((user, index) => {
                    const userCard = document.createElement('div');
                    userCard.classList.add('user-card');

                    let medal = '';
                    if (index === 0) medal = '🥇';
                    else if (index === 1) medal = '🥈';
                    else if (index === 2) medal = '🥉';

                    userCard.innerHTML = `
                        <div class="user-header">
                            <span class="position">${medal} ${index + 1}.</span>
                            <span class="username">${user.username}</span>
                        </div>
                        <div class="user-stats">
                            <p>Skebops Totales: <strong>${user.skebop_count}</strong></p>
                            <p>Valor del Inventario: <strong>$${parseFloat(user.total_value || 0).toFixed(2)}</strong></p>
                        </div>
                        <div class="inventory-section">
                            <h4>Inventario:</h4>
                            <div class="skebop-list-container">
                                <div class="skebop-list" id="skebopList-${user.id}">
                                    ${user.inventory.length > 0 ?
                                        user.inventory.map(item => `
                                            <div class="skebop-item">
                                                <span>${item.name}</span>
                                                <span>$${parseFloat(item.price).toFixed(2)}</span>
                                            </div>
                                        `).join('')
                                        : '<p class="no-skebops">Este usuario no tiene skebops.</p>'
                                    }
                                </div>
                            </div>
                        </div>
                    `;
                    rankingContainer.appendChild(userCard);
                });
            } else {
                rankingContainer.innerHTML = `<p class="no-data">No hay datos de ranking disponibles.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching ranking:', error);
            const rankingContainer = document.getElementById('rankingContainer');
            rankingContainer.innerHTML = `<p class="error-message">Error al cargar el ranking.</p>`;
        });
}
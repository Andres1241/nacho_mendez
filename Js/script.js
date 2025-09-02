let cart = [];
let isLoggedIn = false;

const products = [
    { name: "Skebop Clásico", price: 41.00, image: "https://i1.sndcdn.com/artworks-KEfB0OoBZtQvivLO-6mJK3w-t500x500.png", earningRate: 0.01 },
    { name: "Skebop Raro", price: 45.50, image: "https://i.scdn.co/image/ab67616d00001e022a59c9a295285a44a48aa772", earningRate: 0.02 },
    { name: "Skebop Formidable", price: 55.00, image: "https://pbs.twimg.com/amplify_video_thumb/1944283699236794368/img/StWN9U6ebwRg28Lw.jpg:large", earningRate: 0.05 },
    { name: "Skebop Premium", price: 60.00, image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/01/42/52/014252a0-f2dd-28eb-fe2a-98efed246542/artwork.jpg/600x600bf-60.jpg", earningRate: 0.08 },
    { name: "24K Gold Skebop ", price: 75.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTvF66JIUafhuxDNzYzctq6O8zkistnCqgrMlDlpMe_91GHqgzp03pX7xn_FGvkBJXBGo&usqp=CAU", earningRate: 0.15 },
];

function renderProducts() {
    const productosContainer = document.getElementById('productosContainer');
    productosContainer.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('producto');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="Imagen de ${product.name}">
            <div class="producto-info">
                <h3>${product.name}</h3>
                <p class="precio">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}', ${product.earningRate}, this)">Añadir al carrito</button>
            </div>
        `;
        productosContainer.appendChild(productDiv);
    });
}

function addToCart(productName, productPrice, productImage, earningRate, button) {
    if (!isLoggedIn) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        showLoginModal();
        return;
    }
    const item = {
        name: productName,
        price: productPrice,
        image: productImage,
        earningRate: earningRate
    };
    cart.push(item);
    updateCartDisplay();

    button.classList.add('btn-agregado');
    button.textContent = '¡Agregado!';
    setTimeout(() => {
        button.classList.remove('btn-agregado');
        button.textContent = 'Añadir al carrito';
    }, 1000);
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalDiv = document.getElementById('cartTotal');
    let cartTotal = 0;

    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-message">El carrito está vacío.</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span>$${item.price.toFixed(2)}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Eliminar</button>
            `;
            cartItemsDiv.appendChild(cartItemDiv);
            cartTotal += item.price;
        });
    }

    cartTotalDiv.textContent = `Total: $${cartTotal.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function toggleModal() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function buyItems() {
    if (!isLoggedIn) {
        alert("Debes iniciar sesión para completar la compra.");
        showLoginModal();
        return;
    }

    if (cart.length === 0) {
        alert("El carrito está vacío. ¡Añade algunos productos antes de comprar!");
        return;
    }

    cart.forEach(item => {
        fetch('api.php?action=add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: item.name,
                price: item.price,
                image: item.image,
                earningRate: item.earningRate
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    cart = [];
    updateCartDisplay();
    alert('Compra realizada con éxito. ¡Revisa tu inventario!');
    toggleModal();
}

// Funciones de Autenticación
function showLoginModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    fetch('api.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (data.message) {
            showLoginForm();
        }
    });
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    fetch('api.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            isLoggedIn = true;
            localStorage.setItem('username', username);
            updateNavUI();
            hideAuthModal();
            alert("¡Bienvenido, " + username + "!");
        } else {
            alert(data.error);
        }
    });
}

function logout() {
    fetch('api.php?action=logout')
    .then(response => response.json())
    .then(data => {
        isLoggedIn = false;
        localStorage.removeItem('username');
        updateNavUI();
        alert("Sesión cerrada.");
    });
}

function updateNavUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const welcomeMessage = document.getElementById('welcome-message');

    if (isLoggedIn) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        welcomeMessage.textContent = 'Bienvenido, ' + localStorage.getItem('username');
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

window.onload = () => {
    isLoggedIn = !!localStorage.getItem('username');
    updateNavUI();
    renderProducts();

    const randomNumber = Math.random();
    const videoOverlay = document.getElementById('videoOverlay');
    const originalVideoLink = "https://www.youtube.com/watch?v=BbeeuzU5Qc8";
    const embedVideoLink = originalVideoLink.replace("watch?v=", "embed/") + "?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0";
    const joshVideoIframe = `<iframe src="${embedVideoLink}" title="Video de Josh Hutcherson" frameborder="0" allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    if (randomNumber < 0.33) {
        videoOverlay.innerHTML = joshVideoIframe;
        videoOverlay.style.display = 'flex';
        setTimeout(() => {
            videoOverlay.style.display = 'none';
            videoOverlay.innerHTML = '';
        }, 30000);
    }
};
 let cart = [];

        const products = [
            { name: "Skebop Clásico", price: 41.00, image: "https://i1.sndcdn.com/artworks-KEfB0OoBZtQvivLO-6mJK3w-t500x500.png" },
            { name: "Skebop Raro", price: 45.50, image: "https://i.scdn.co/image/ab67616d00001e022a59c9a295285a44a48aa772" },
            { name: "Skebop Premium", price: 60.00, image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/01/42/52/014252a0-f2dd-28eb-fe2a-98efed246542/artwork.jpg/600x600bf-60.jpg" },
            { name: "24K Gold Skebop ", price: 75.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTvF66JIUafhuxDNzYzctq6O8zkistnCqgrMlDlpMe_91GHqgzp03pX7xn_FGvkBJXBGo&usqp=CAU" },
            { name: "Skebop Formidable", price: 55.00, image: "https://pbs.twimg.com/amplify_video_thumb/1944283699236794368/img/StWN9U6ebwRg28Lw.jpg:large" }
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
                        <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Añadir al carrito</button>
                    </div>
                `;
                productosContainer.appendChild(productDiv);
            });
        }

        function addToCart(productName, productPrice, productImage) {
            const item = {
                name: productName,
                price: productPrice,
                image: productImage
            };
            cart.push(item);
            updateCartDisplay();
        }

        function updateCartDisplay() {
            const cartItemsDiv = document.getElementById('cartItems');
            const cartTotalDiv = document.getElementById('cartTotal');
            let cartTotal = 0;

            cartItemsDiv.innerHTML = '';

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

        // Inicializa los productos al cargar la página
        window.onload = renderProducts;






// Genera un número aleatorio entre 0 y 1
const randomNumber = Math.random();

// Define el contenedor del overlay para el video
const videoOverlay = document.getElementById('videoOverlay');

// El enlace original del video
const originalVideoLink = "https://www.youtube.com/watch?v=BbeeuzU5Qc8";

// Transforma el enlace para que sea compatible con embed y agrega parámetros de autoplay y mute
// mute=1 es CRUCIAL para que el autoplay funcione en la mayoría de los navegadores modernos.
const embedVideoLink = originalVideoLink.replace("watch?v=", "embed/") + "?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0";

// El HTML del iframe para el video
const joshVideoIframe = `
    <iframe src="${embedVideoLink}" 
    title="Video de Josh Hutcherson" frameborder="0" 
    allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
`;

// Verifica si el número aleatorio es menor que 0.33 (33% de probabilidad)
if (randomNumber < 0.33) {
    console.log("¡Probabilidad cumplida! El video de Josh Hutcherson se muestra a pantalla completa.");

    // Inserta el iframe en el overlay
    videoOverlay.innerHTML = joshVideoIframe;
    // Muestra el overlay (que está diseñado para ser de pantalla completa)
    videoOverlay.style.display = 'flex'; 

    // Opcional: Después de unos segundos, puedes ocultar el video automáticamente
    // Por ejemplo, después de 30 segundos (30000 milisegundos)
    setTimeout(() => {
        videoOverlay.style.display = 'none'; // Oculta el video
        videoOverlay.innerHTML = ''; // Limpia el contenido para detener la reproducción
        console.log("El video de Josh Hutcherson ha terminado de mostrarse.");
    }, 30000); // Duración en milisegundos

} else {
    console.log("No se mostró el video de Josh Hutcherson esta vez.");
    // Si no se muestra el video, el overlay permanece oculto.
}
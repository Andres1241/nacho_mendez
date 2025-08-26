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
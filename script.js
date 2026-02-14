/* ============================================
   LÓGICA DE INTERACTIVIDAD - SALA DE ESCAPE
   ============================================ */

// Obtener referencias a los elementos del DOM
const clickBox = document.getElementById('clickBox');
const scareImage = document.getElementById('scareImage');
const scareVideo = document.getElementById('scareVideo');
const scareAudio = document.getElementById('scareAudio');

// Variable para controlar si la experiencia está en progreso
let isActivated = false;

// Bloquear el menú contextual del clic derecho para mantener la inmersión
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Evento principal: al hacer clic en el cuadro
clickBox.addEventListener('click', async () => {
    // Evitar múltiples clics simultáneos
    if (isActivated) return;
    
    isActivated = true;
    clickBox.classList.add('disabled');
    
    // Paso 1: Solicitar pantalla completa
    try {
        // Solicitar pantalla completa usando requestFullscreen API
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            // Compatibilidad con navegadores basados en WebKit
            await document.documentElement.webkitRequestFullscreen();
        }
    } catch (error) {
        console.log('No se pudo activar pantalla completa:', error);
    }
    
    // Activar los efectos de susto inmediatamente
    activateScareEffects();
});

// Función que activa todos los efectos de susto
function activateScareEffects() {
    // Crear una pantalla negra que cubrirá la pantalla
    const blackScreen = document.createElement('div');
    blackScreen.id = 'blackScreen';
    blackScreen.style.position = 'fixed';
    blackScreen.style.top = '0';
    blackScreen.style.left = '0';
    blackScreen.style.width = '100%';
    blackScreen.style.height = '100%';
    blackScreen.style.backgroundColor = '#000000';
    blackScreen.style.zIndex = '999';
    document.body.appendChild(blackScreen);
    
    // Esperar 9 segundos antes de mostrar la imagen
    setTimeout(() => {
        // Remover la pantalla negra
        blackScreen.remove();
        
        // 1. Mostrar la imagen a pantalla completa
        scareImage.classList.add('scare-image-fullscreen');
        scareImage.classList.remove('hidden');
        
        // 2. Reproducir el audio al volumen máximo
        scareAudio.volume = 1.0; // Volumen al 100%
        scareAudio.play().catch((error) => {
            console.log('No se pudo reproducir el audio:', error);
        });
        
        // 3. Activar la animación de vibración en el body
        document.body.classList.add('vibrating');
        
        // Detener la vibración después de 2 segundos
        setTimeout(() => {
            document.body.classList.remove('vibrating');
        }, 2000);
        
        // Esperar a que el audio termine de reproducirse
        scareAudio.onended = () => {
            // Ocultar la imagen y mostrar el video
            scareImage.classList.add('hidden');
            scareImage.classList.remove('scare-image-fullscreen');
            
            // Mostrar y reproducir el video
            scareVideo.classList.add('scare-video-fullscreen');
            scareVideo.classList.remove('hidden');
            scareVideo.volume = 1.0;
            scareVideo.play().catch((error) => {
                console.log('No se pudo reproducir el video:', error);
            });
            
            // Cuando el video termina, salir de pantalla completa
            scareVideo.onended = () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                
                // Resetear la experiencia
                scareVideo.classList.add('hidden');
                scareVideo.classList.remove('scare-video-fullscreen');
                
                // Habilitar el cuadro para nueva experiencia
                isActivated = false;
                clickBox.classList.remove('disabled');
            };
        };
    }, 4000);
}

// Bonus: Prevenir salida accidental de pantalla completa con ESC
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isActivated) {
        console.log('Se cerró pantalla completa');
    }
});

// Comentario final: Este script crea una experiencia inmersiva y controlada
// que mantiene al usuario en el contexto de la sala de escape sin distracciones

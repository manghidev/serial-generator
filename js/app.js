// Configuración de idiomas
const translations = {
    es: {
        title: "Generador de Seriales Ultra Únicos",
        minSegmentLength: "Longitud Mínima de Segmento:",
        maxSegmentLength: "Longitud Máxima de Segmento:",
        randomPartLength: "Longitud de Parte Aleatoria (sin guiones/timestamp):",
        prefix: "Prefijo (Opcional):",
        generateButton: "Generar Serial",
        copyButton: "Copiar Serial",
        copied: "¡Copiado!",
        initialMessage: "Haz clic en \"Generar Serial\"",
        generating: "Generando...",
        errorPrefix: "Error:",
        errorMessage: "Asegúrate de que tu navegador soporta Web Crypto API y los valores son válidos.",
        copyError: "No se pudo copiar el serial. Por favor, cópialo manualmente."
    },
    en: {
        title: "Ultra Unique Serial Generator",
        minSegmentLength: "Minimum Segment Length:",
        maxSegmentLength: "Maximum Segment Length:",
        randomPartLength: "Random Part Length (without dashes/timestamp):",
        prefix: "Prefix (Optional):",
        generateButton: "Generate Serial",
        copyButton: "Copy Serial",
        copied: "Copied!",
        initialMessage: "Click \"Generate Serial\"",
        generating: "Generating...",
        errorPrefix: "Error:",
        errorMessage: "Make sure your browser supports Web Crypto API and the values are valid.",
        copyError: "Could not copy the serial. Please copy it manually."
    }
};

// Estado global de la aplicación
let currentLanguage = 'es';
let currentSerial = '';

// Función para generar el serial con alta entropía
async function generateHighEntropySerialNumber(
    minSegmentLength = 4,
    maxSegmentLength = 8,
    randomPartLength = 24,
    prefix = null
) {
    // Validaciones y Ajustes de Parámetros
    const validatedMinSegmentLength = Math.max(1, minSegmentLength);
    const validatedMaxSegmentLength = Math.max(validatedMinSegmentLength, maxSegmentLength);
    const validatedRandomPartLength = Math.max(validatedMinSegmentLength, randomPartLength);

    // Configuración de Caracteres
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charsLength = chars.length; // 36 caracteres

    // Manejo Eficiente de Bytes Aleatorios
    const BYTE_BUFFER_SIZE = 256;
    let byteBuffer = new Uint8Array(BYTE_BUFFER_SIZE);
    let byteBufferIndex = BYTE_BUFFER_SIZE; // Inicializamos al límite para forzar la primera recarga

    const getSecureRandomByte = () => {
        if (byteBufferIndex >= BYTE_BUFFER_SIZE) {
            window.crypto.getRandomValues(byteBuffer);
            byteBufferIndex = 0;
        }
        return byteBuffer[byteBufferIndex++];
    };

    // 1. Generar la Parte de la Marca de Tiempo
    const timestampPart = Date.now().toString(36).toUpperCase();

    // 2. Generar los Caracteres Aleatorios Brutos
    let rawRandomChars = '';
    for (let i = 0; i < validatedRandomPartLength; i++) {
        const byteValue = getSecureRandomByte();
        const randomIndex = Math.floor((byteValue / BYTE_BUFFER_SIZE) * charsLength);
        rawRandomChars += chars[randomIndex];
    }

    // 3. Formato de la Parte Aleatoria con Guiones Random
    let formattedRandomPart = '';
    let currentPosInRandom = 0;

    while (currentPosInRandom < validatedRandomPartLength) {
        let segmentLengthToUse = validatedMinSegmentLength;

        const remainingCharsInRandomPart = validatedRandomPartLength - (currentPosInRandom + validatedMinSegmentLength);
        if (remainingCharsInRandomPart > 0) {
            const maxAdditionalLengthForSegment = Math.min(
                validatedMaxSegmentLength - validatedMinSegmentLength,
                remainingCharsInRandomPart
            );
            if (maxAdditionalLengthForSegment > 0) {
                const randomByte = getSecureRandomByte();
                segmentLengthToUse += Math.floor((randomByte / BYTE_BUFFER_SIZE) * (maxAdditionalLengthForSegment + 1));
            }
        } else {
            segmentLengthToUse = validatedRandomPartLength - currentPosInRandom;
        }

        formattedRandomPart += rawRandomChars.substring(currentPosInRandom, currentPosInRandom + segmentLengthToUse);
        currentPosInRandom += segmentLengthToUse;

        if (currentPosInRandom < validatedRandomPartLength) {
            formattedRandomPart += '-';
        }
    }

    // 4. Construir el Serial Final Usando un Array
    const finalSerialParts = [];

    if (prefix && String(prefix).trim().length > 0) {
        finalSerialParts.push(String(prefix).toUpperCase().trim());
    }

    finalSerialParts.push(timestampPart);
    finalSerialParts.push(formattedRandomPart);

    return finalSerialParts.join('-');
}

// Función para cambiar el idioma
function changeLanguage(lang) {
    currentLanguage = lang;
    updateUI();
    
    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Guardar preferencia en localStorage
    localStorage.setItem('preferredLanguage', lang);
}

// Función para actualizar la interfaz de usuario
function updateUI() {
    const t = translations[currentLanguage];
    
    // Actualizar textos
    document.getElementById('title').textContent = t.title;
    document.querySelector('label[for="minSegmentLength"]').textContent = t.minSegmentLength;
    document.querySelector('label[for="maxSegmentLength"]').textContent = t.maxSegmentLength;
    document.querySelector('label[for="randomPartLength"]').textContent = t.randomPartLength;
    document.querySelector('label[for="prefix"]').textContent = t.prefix;
    document.getElementById('generateButton').textContent = t.generateButton;
    
    // Actualizar botón de copiar solo si no está en estado "copiado"
    const copyButton = document.getElementById('copyButton');
    if (!copyButton.classList.contains('copied')) {
        copyButton.textContent = t.copyButton;
    }
    
    // Actualizar mensaje inicial si es necesario
    const serialOutput = document.getElementById('serialOutput');
    if (serialOutput.textContent === translations.es.initialMessage || 
        serialOutput.textContent === translations.en.initialMessage) {
        serialOutput.textContent = t.initialMessage;
    }
}

// Función para manejar la generación del serial
async function handleGenerateSerial() {
    const t = translations[currentLanguage];
    const serialOutput = document.getElementById('serialOutput');
    const copyButton = document.getElementById('copyButton');
    
    serialOutput.textContent = t.generating;
    serialOutput.style.color = '#72ef72'; // Resetear color a verde
    copyButton.classList.remove('copied'); // Asegurar que el botón de copiar no esté en estado "copiado"
    copyButton.textContent = t.copyButton; // Resetear texto del botón de copiar

    try {
        const minSegLen = parseInt(document.getElementById('minSegmentLength').value);
        const maxSegLen = parseInt(document.getElementById('maxSegmentLength').value);
        const randPartLen = parseInt(document.getElementById('randomPartLength').value);
        const prefixVal = document.getElementById('prefix').value.trim();

        const generatedSerial = await generateHighEntropySerialNumber(
            minSegLen,
            maxSegLen,
            randPartLen,
            prefixVal
        );
        
        currentSerial = generatedSerial;
        serialOutput.textContent = generatedSerial;
        copyButton.style.display = 'inline-block'; // Mostrar botón de copiar
    } catch (error) {
        console.error("Error al generar el serial:", error);
        serialOutput.textContent = `${t.errorPrefix} ${error.message}. ${t.errorMessage}`;
        serialOutput.style.color = '#e94560'; // Color de error
        copyButton.style.display = 'none'; // Ocultar si hay error
    }
}

// Función para copiar al portapapeles
function copyToClipboard() {
    const t = translations[currentLanguage];
    const copyButton = document.getElementById('copyButton');
    
    if (currentSerial && currentSerial !== t.initialMessage && !currentSerial.startsWith(t.errorPrefix)) {
        navigator.clipboard.writeText(currentSerial).then(() => {
            copyButton.textContent = t.copied;
            copyButton.classList.add('copied');
            setTimeout(() => {
                copyButton.textContent = t.copyButton;
                copyButton.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar al portapapeles:', err);
            alert(t.copyError);
        });
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar idioma preferido del localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';
    currentLanguage = savedLanguage;
    
    // Configurar event listeners
    document.getElementById('generateButton').addEventListener('click', handleGenerateSerial);
    document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    
    // Configurar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Inicializar UI
    changeLanguage(currentLanguage);
    
    // Generar un serial inicial
    handleGenerateSerial();
});

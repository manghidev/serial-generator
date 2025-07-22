// Configuración de idiomas
const translations = {
    es: {
        title: "Generador de Seriales Ultra Únicos",
        segmentLength: "Tamaño de Segmentos:",
        totalRandomLength: "Caracteres Aleatorios:",
        prefix: "Prefijo (Opcional):",
        generateButton: "Generar Serial",
        copyButton: "Copiar Serial",
        copied: "¡Copiado!",
        initialMessage: "Haz clic en \"Generar Serial\"",
        generating: "Generando...",
        errorPrefix: "Error:",
        errorMessage: "Asegúrate de que tu navegador soporta Web Crypto API y los valores son válidos.",
        copyError: "No se pudo copiar el serial. Por favor, cópialo manualmente.",
        generatorTab: "Generar Serial",
        decoderTab: "Decodificar Fecha",
        decoderDescription: "Pega un serial generado anteriormente para ver cuándo fue creado",
        serialInput: "Serial a Decodificar:",
        decodeButton: "Decodificar Fecha",
        dateOutputInitial: "Ingresa un serial para ver su fecha de creación",
        invalidSerial: "Serial inválido o no contiene timestamp",
        createdOn: "Serial creado el:",
        at: "a las"
    },
    en: {
        title: "Ultra Unique Serial Generator",
        segmentLength: "Segment Size:",
        totalRandomLength: "Random Characters:",
        prefix: "Prefix (Optional):",
        generateButton: "Generate Serial",
        copyButton: "Copy Serial",
        copied: "Copied!",
        initialMessage: "Click \"Generate Serial\"",
        generating: "Generating...",
        errorPrefix: "Error:",
        errorMessage: "Make sure your browser supports Web Crypto API and the values are valid.",
        copyError: "Could not copy the serial. Please copy it manually.",
        generatorTab: "Generate Serial",
        decoderTab: "Decode Date",
        decoderDescription: "Paste a previously generated serial to see when it was created",
        serialInput: "Serial to Decode:",
        decodeButton: "Decode Date",
        dateOutputInitial: "Enter a serial to see its creation date",
        invalidSerial: "Invalid serial or no timestamp found",
        createdOn: "Serial created on:",
        at: "at"
    }
};

// Estado global de la aplicación
let currentLanguage = 'es';
let currentSerial = '';
let currentTab = 'generator';

// Función para cambiar de pestaña
function switchTab(tabName) {
    currentTab = tabName;
    
    // Actualizar botones de pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Actualizar contenido de pestañas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-section`).classList.add('active');
    
    // Guardar preferencia en localStorage
    localStorage.setItem('preferredTab', tabName);
}

// Función para generar el serial con alta entropía
async function generateHighEntropySerialNumber(
    segmentLength = 6,
    totalRandomLength = 24,
    prefix = null
) {
    // Validaciones y Ajustes de Parámetros
    const validatedSegmentLength = Math.max(1, Math.min(12, segmentLength));
    const validatedTotalRandomLength = Math.max(6, Math.min(50, totalRandomLength));

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
    for (let i = 0; i < validatedTotalRandomLength; i++) {
        const byteValue = getSecureRandomByte();
        const randomIndex = Math.floor((byteValue / BYTE_BUFFER_SIZE) * charsLength);
        rawRandomChars += chars[randomIndex];
    }

    // 3. Formato de la Parte Aleatoria con Guiones
    let formattedRandomPart = '';
    let currentPos = 0;

    while (currentPos < validatedTotalRandomLength) {
        const remainingLength = validatedTotalRandomLength - currentPos;
        const currentSegmentLength = Math.min(validatedSegmentLength, remainingLength);
        
        formattedRandomPart += rawRandomChars.substring(currentPos, currentPos + currentSegmentLength);
        currentPos += currentSegmentLength;

        if (currentPos < validatedTotalRandomLength) {
            formattedRandomPart += '-';
        }
    }

    // 4. Construir el Serial Final
    const finalSerialParts = [];

    if (prefix && String(prefix).trim().length > 0) {
        finalSerialParts.push(String(prefix).toUpperCase().trim());
    }

    finalSerialParts.push(timestampPart);
    finalSerialParts.push(formattedRandomPart);

    return finalSerialParts.join('-');
}

// Función para decodificar la fecha de un serial
function decodeSerialTimestamp(serial) {
    if (!serial || typeof serial !== 'string') {
        return null;
    }

    // Dividir el serial por guiones
    const parts = serial.split('-');
    
    if (parts.length < 2) {
        return null;
    }

    // El timestamp está en la segunda parte (después del prefijo si existe)
    let timestampPart;
    
    // Si hay prefijo, el timestamp está en el segundo elemento
    // Si no hay prefijo, está en el primer elemento
    if (parts.length >= 3) {
        timestampPart = parts[1]; // Con prefijo
    } else {
        timestampPart = parts[0]; // Sin prefijo
    }

    try {
        // Convertir de base36 a timestamp
        const timestamp = parseInt(timestampPart, 36);
        
        // Verificar que el timestamp sea válido (debe ser un número positivo razonable)
        if (isNaN(timestamp) || timestamp <= 0 || timestamp > Date.now() + 86400000) { // +1 día de margen
            return null;
        }

        return new Date(timestamp);
    } catch (error) {
        return null;
    }
}

// Función para formatear la fecha decodificada
function formatDecodedDate(date, language = 'es') {
    if (!date || !(date instanceof Date)) {
        return null;
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, options);
}

// Función para manejar la decodificación de seriales
function handleDecodeSerial() {
    const t = translations[currentLanguage];
    const serialInput = document.getElementById('serialInput');
    const dateOutput = document.getElementById('dateOutput');
    
    const inputSerial = serialInput.value.trim();
    
    if (!inputSerial) {
        dateOutput.textContent = t.dateOutputInitial;
        dateOutput.style.color = '#72ef72';
        return;
    }
    
    const decodedDate = decodeSerialTimestamp(inputSerial);
    
    if (decodedDate) {
        const formattedDate = formatDecodedDate(decodedDate, currentLanguage);
        dateOutput.textContent = `${t.createdOn} ${formattedDate}`;
        dateOutput.style.color = '#72ef72';
    } else {
        dateOutput.textContent = t.invalidSerial;
        dateOutput.style.color = '#e94560';
    }
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
    
    // Actualizar textos principales
    document.getElementById('title').textContent = t.title;
    document.querySelector('label[for="segmentLength"]').textContent = t.segmentLength;
    document.querySelector('label[for="totalRandomLength"]').textContent = t.totalRandomLength;
    document.querySelector('label[for="prefix"]').textContent = t.prefix;
    document.getElementById('generateButton').textContent = t.generateButton;
    
    // Actualizar pestañas
    document.getElementById('generatorTabText').textContent = t.generatorTab;
    document.getElementById('decoderTabText').textContent = t.decoderTab;
    
    // Actualizar sección de decodificación
    document.getElementById('decoderDescription').textContent = t.decoderDescription;
    document.querySelector('label[for="serialInput"]').textContent = t.serialInput;
    document.getElementById('decodeButton').textContent = t.decodeButton;
    
    // Actualizar placeholder del input de serial
    document.getElementById('serialInput').placeholder = currentLanguage === 'es' ? 
        'Ejemplo: PRODKEY-1ABCD23-EF45-GH67' : 
        'Example: PRODKEY-1ABCD23-EF45-GH67';
    
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
    
    // Actualizar mensaje inicial del decodificador si es necesario
    const dateOutput = document.getElementById('dateOutput');
    if (dateOutput.textContent === translations.es.dateOutputInitial || 
        dateOutput.textContent === translations.en.dateOutputInitial) {
        dateOutput.textContent = t.dateOutputInitial;
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
        const segmentLen = parseInt(document.getElementById('segmentLength').value);
        const totalRandomLen = parseInt(document.getElementById('totalRandomLength').value);
        const prefixVal = document.getElementById('prefix').value.trim();

        const generatedSerial = await generateHighEntropySerialNumber(
            segmentLen,
            totalRandomLen,
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
    // Cargar preferencias del localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';
    const savedTab = localStorage.getItem('preferredTab') || 'generator';
    currentLanguage = savedLanguage;
    currentTab = savedTab;
    
    // Configurar event listeners principales
    document.getElementById('generateButton').addEventListener('click', handleGenerateSerial);
    document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    document.getElementById('decodeButton').addEventListener('click', handleDecodeSerial);
    
    // Configurar event listeners para pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.currentTarget.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Configurar auto-generación cuando cambien los inputs (solo en la pestaña generador)
    const autoGenerateInputs = ['segmentLength', 'totalRandomLength', 'prefix'];
    autoGenerateInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', () => {
            // Solo auto-generar si estamos en la pestaña de generador
            if (currentTab === 'generator') {
                clearTimeout(input.autoGenerateTimeout);
                input.autoGenerateTimeout = setTimeout(() => {
                    handleGenerateSerial();
                }, 500);
            }
        });
    });
    
    // Configurar decodificación automática cuando se escriba en el input de serial
    const serialInput = document.getElementById('serialInput');
    serialInput.addEventListener('input', () => {
        clearTimeout(serialInput.decodeTimeout);
        serialInput.decodeTimeout = setTimeout(() => {
            handleDecodeSerial();
        }, 300);
    });
    
    // Configurar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Inicializar UI
    changeLanguage(currentLanguage);
    switchTab(currentTab);
    
    // Generar un serial inicial solo si estamos en la pestaña de generador
    if (currentTab === 'generator') {
        handleGenerateSerial();
    }
});

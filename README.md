# 🔑 Generador de Seriales Ultra Únicos / Ultra Unique Serial Generator

[English](#english) | [Español](#español)

---

## Español

### 🚀 ¿Qué es esto?

Un generador de seriales web avanzado que crea códigos únicos y seguros utilizando criptografía de alta calidad. Perfecto para generar claves de producto, licencias de software, códigos de activación y cualquier tipo de identificador único que necesites.

### ✨ Características Principales

- **🔒 Seguridad Criptográfica**: Utiliza la Web Crypto API del navegador para garantizar aleatoriedad verdadera
- **🎛️ Altamente Configurable**: 
  - Longitud mínima y máxima de segmentos
  - Longitud personalizable de la parte aleatoria
  - Prefijos opcionales para organización
- **⏰ Timestamp Integrado**: Cada serial incluye una marca temporal para garantizar unicidad
- **🌍 Multiidioma**: Interfaz disponible en español e inglés
- **📱 Responsive**: Funciona perfectamente en dispositivos móviles y escritorio
- **🎨 Diseño Moderno**: Interfaz oscura y elegante
- **📋 Copia Fácil**: Un clic para copiar el serial generado

### 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con variables CSS y flexbox
- **JavaScript ES6+**: Lógica avanzada con async/await y Web Crypto API
- **Arquitectura Modular**: Separación clara entre HTML, CSS y JavaScript

### 📁 Estructura del Proyecto

```
serial-generator/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos y diseño
├── js/
│   └── app.js          # Lógica de la aplicación
└── README.md           # Esta documentación
```

### 🚀 Cómo Usar

1. **Abre el proyecto**: Simplemente abre `index.html` en tu navegador
2. **Configura los parámetros**:
   - **Longitud Mínima/Máxima de Segmento**: Define el tamaño de cada parte del serial
   - **Longitud de Parte Aleatoria**: Controla la cantidad de caracteres aleatorios
   - **Prefijo**: Añade un identificador personalizado (opcional)
3. **Genera**: Haz clic en "Generar Serial"
4. **Copia**: Usa el botón "Copiar Serial" para llevarlo al portapapeles

### 🔧 Personalización

#### Cambiar Idioma
- Usa los botones **ES** / **EN** en la esquina superior derecha
- El idioma se guarda automáticamente en tu navegador

#### Ejemplo de Seriales Generados
```
PRODKEY-LQ2XR4G-F8X2-9K4LNP3X-7WQ5M2RT
TESTKEY-LQ2XS1A-H5XK-R9L3NF7B-2QT6W8YU
MYAPP-LQ2XT2B-G7ZM-4J8KLN6P-9RS3V5WX
```

### 🔐 Seguridad

- **Entropía Alta**: Cada serial tiene miles de millones de combinaciones posibles
- **Criptografía Segura**: Usa `crypto.getRandomValues()` del navegador
- **No Predecible**: Imposible de adivinar o generar duplicados
- **Timestamp Único**: Garantiza que cada serial sea irrepetible

### 🌐 Compatibilidad

- ✅ Chrome 11+
- ✅ Firefox 21+
- ✅ Safari 6.1+
- ✅ Edge 12+
- ✅ Dispositivos móviles modernos

### 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de usarlo, modificarlo y distribuirlo.

---

## English

### 🚀 What is this?

An advanced web serial generator that creates unique and secure codes using high-quality cryptography. Perfect for generating product keys, software licenses, activation codes, and any type of unique identifier you need.

### ✨ Key Features

- **🔒 Cryptographic Security**: Uses the browser's Web Crypto API to ensure true randomness
- **🎛️ Highly Configurable**: 
  - Minimum and maximum segment length
  - Customizable random part length
  - Optional prefixes for organization
- **⏰ Integrated Timestamp**: Each serial includes a timestamp to guarantee uniqueness
- **🌍 Multilingual**: Interface available in Spanish and English
- **📱 Responsive**: Works perfectly on mobile and desktop devices
- **🎨 Modern Design**: Dark and elegant interface
- **📋 Easy Copy**: One click to copy the generated serial

### 🛠️ Technologies Used

- **HTML5**: Semantic and accessible structure
- **CSS3**: Modern design with CSS variables and flexbox
- **JavaScript ES6+**: Advanced logic with async/await and Web Crypto API
- **Modular Architecture**: Clear separation between HTML, CSS, and JavaScript

### 📁 Project Structure

```
serial-generator/
├── index.html          # Main page
├── css/
│   └── styles.css      # Styles and design
├── js/
│   └── app.js          # Application logic
└── README.md           # This documentation
```

### 🚀 How to Use

1. **Open the project**: Simply open `index.html` in your browser
2. **Configure parameters**:
   - **Min/Max Segment Length**: Define the size of each serial part
   - **Random Part Length**: Control the amount of random characters
   - **Prefix**: Add a custom identifier (optional)
3. **Generate**: Click "Generate Serial"
4. **Copy**: Use the "Copy Serial" button to take it to clipboard

### 🔧 Customization

#### Change Language
- Use the **ES** / **EN** buttons in the top right corner
- Language is automatically saved in your browser

#### Example Generated Serials
```
PRODKEY-LQ2XR4G-F8X2-9K4LNP3X-7WQ5M2RT
TESTKEY-LQ2XS1A-H5XK-R9L3NF7B-2QT6W8YU
MYAPP-LQ2XT2B-G7ZM-4J8KLN6P-9RS3V5WX
```

### 🔐 Security

- **High Entropy**: Each serial has billions of possible combinations
- **Secure Cryptography**: Uses browser's `crypto.getRandomValues()`
- **Unpredictable**: Impossible to guess or generate duplicates
- **Unique Timestamp**: Ensures each serial is unrepeatable

### 🌐 Compatibility

- ✅ Chrome 11+
- ✅ Firefox 21+
- ✅ Safari 6.1+
- ✅ Edge 12+
- ✅ Modern mobile devices

### 📄 License

This project is open source. Feel free to use, modify, and distribute it.

---

### 👨‍💻 Desarrollo / Development

Para contribuir al proyecto o reportar issues, el código está organizado de manera modular y bien documentado. Cada función tiene comentarios explicativos y el código sigue las mejores prácticas de JavaScript moderno.

*To contribute to the project or report issues, the code is organized in a modular way and well documented. Each function has explanatory comments and the code follows modern JavaScript best practices.*

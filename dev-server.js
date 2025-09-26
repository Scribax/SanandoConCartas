// Servidor de desarrollo para archivos estáticos
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.DEV_PORT || 8080;

// Servir archivos estáticos
app.use(express.static('.'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware para CORS en desarrollo
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(PORT, () => {
    console.log(`🚀 Frontend Development Server running at:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   http://127.0.0.1:${PORT}`);
    console.log('\n📝 Press Ctrl+C to stop the server');
    console.log('\n✨ Ready for live development!');
});
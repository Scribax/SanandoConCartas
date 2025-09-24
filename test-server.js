// Servidor de prueba para verificar que todo funcione
require('dotenv').config();

// Probar diferentes formas de importar nodemailer
let nodemailer;
try {
    nodemailer = require('nodemailer');
console.log('📦 Nodemailer importado como CommonJS');
    console.log('🔍 Nodemailer object keys:', Object.keys(nodemailer));
    console.log('🔍 Nodemailer type:', typeof nodemailer);
    console.log('🔍 Has createTransporter?', typeof nodemailer.createTransporter);
} catch (e) {
    console.log('❌ Error importando nodemailer:', e.message);
    process.exit(1);
}

console.log('🔍 Verificando configuración...');
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configurado' : '❌ No configurado');
console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Configurado' : '❌ No configurado');
console.log('📁 DRIVE_LINK:', process.env.DRIVE_LINK ? '✅ Configurado' : '❌ No configurado');

// Probar nodemailer
try {
    console.log('\n🧪 Probando nodemailer...');
    
    const emailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    console.log('✅ EmailTransporter creado exitosamente');

    // Verificar credenciales
    emailTransporter.verify(function(error, success) {
        if (error) {
            console.log('❌ Error en credenciales de email:', error.message);
            console.log('\n🔧 Verifica que:');
            console.log('1. El EMAIL_USER sea tu email de Gmail');
            console.log('2. El EMAIL_PASS sea la contraseña de aplicación (16 caracteres)');
            console.log('3. Tengas verificación en 2 pasos activada');
        } else {
            console.log('✅ Credenciales de email verificadas correctamente');
            
            // Enviar email de prueba
            const testEmail = {
                from: `"Sanando Con Cartas Test" <${process.env.EMAIL_USER}>`,
                to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                subject: '🧪 Test: Sistema funcionando',
                html: `
                    <h2>¡Sistema de email funcionando!</h2>
                    <p>Si recibes este email, significa que:</p>
                    <ul>
                        <li>✅ Node.js está funcionando</li>
                        <li>✅ Nodemailer está configurado</li>
                        <li>✅ Las credenciales de Gmail son correctas</li>
                        <li>✅ El sistema está listo para enviar emails automáticamente</li>
                    </ul>
                    <p><strong>¡Tu sistema está listo para funcionar!</strong></p>
                `
            };

            emailTransporter.sendMail(testEmail, (error, info) => {
                if (error) {
                    console.log('❌ Error enviando email de prueba:', error.message);
                } else {
                    console.log('✅ Email de prueba enviado exitosamente!');
                    console.log('📬 Revisa tu bandeja de entrada');
                }
                process.exit(0);
            });
        }
    });

} catch (error) {
    console.log('❌ Error creando emailTransporter:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. npm install nodemailer');
    console.log('2. Verificar archivo .env');
    process.exit(1);
}
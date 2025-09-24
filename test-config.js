// Script de prueba para verificar que toda la configuración funciona correctamente

const nodemailer = require('nodemailer');

console.log('🧪 INICIANDO PRUEBAS DE CONFIGURACIÓN\n');

// ===== CONFIGURACIÓN =====
const CONFIG = {
    email: {
        user: 'bostonstock2025@gmail.com',
        pass: 'ppgt nhfg nbgz oepx'
    },
    mercadopago: {
        public_key: 'APP_USR-82a9259a-1964-4bbe-a4c4-8ab50745ba4d',
        access_token: 'APP_USR-2823973966774541-070800-09828874bdf313cfa30a5c8f334e7f9b-305616995'
    },
    googleDrive: 'https://drive.google.com/drive/folders/1QuJYZSicxy8Sd1V-jl42lGKSU43_UOAh?usp=sharing'
};

// ===== PRUEBA 1: CONFIGURACIÓN DE EMAIL =====
async function testEmailConfig() {
    console.log('1️⃣ Probando configuración de email...');
    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: CONFIG.email.user,
                pass: CONFIG.email.pass
            }
        });

        // Verificar conexión
        await transporter.verify();
        console.log('   ✅ Email configurado correctamente');
        return true;
    } catch (error) {
        console.log('   ❌ Error en configuración de email:', error.message);
        return false;
    }
}

// ===== PRUEBA 2: CREDENCIALES DE MERCADOPAGO =====
async function testMercadoPagoConfig() {
    console.log('2️⃣ Probando credenciales de MercadoPago...');
    
    try {
        // Verificar formato de las credenciales
        if (!CONFIG.mercadopago.public_key.startsWith('APP_USR-')) {
            throw new Error('Public Key no tiene el formato correcto');
        }
        
        if (!CONFIG.mercadopago.access_token.startsWith('APP_USR-')) {
            throw new Error('Access Token no tiene el formato correcto');
        }

        console.log('   ✅ Formato de credenciales MercadoPago correcto');
        console.log('   📝 Public Key:', CONFIG.mercadopago.public_key.substring(0, 20) + '...');
        console.log('   📝 Access Token:', CONFIG.mercadopago.access_token.substring(0, 20) + '...');
        return true;
    } catch (error) {
        console.log('   ❌ Error en credenciales MercadoPago:', error.message);
        return false;
    }
}

// ===== PRUEBA 3: GOOGLE DRIVE =====
async function testGoogleDriveConfig() {
    console.log('3️⃣ Probando configuración de Google Drive...');
    
    try {
        const url = new URL(CONFIG.googleDrive);
        if (!url.hostname.includes('drive.google.com')) {
            throw new Error('URL no es de Google Drive');
        }
        
        console.log('   ✅ URL de Google Drive válida');
        console.log('   📝 Link:', CONFIG.googleDrive);
        return true;
    } catch (error) {
        console.log('   ❌ Error en URL de Google Drive:', error.message);
        return false;
    }
}

// ===== PRUEBA 4: ENVÍO DE EMAIL DE PRUEBA =====
async function testEmailSending() {
    console.log('4️⃣ Probando envío de email...');
    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: CONFIG.email
        });

        const testEmail = {
            from: `"Sanando Con Cartas Test 🔮" <${CONFIG.email.user}>`,
            to: CONFIG.email.user, // Enviarse a sí mismo
            subject: '🧪 PRUEBA - Sistema de Entrega Configurado',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #6B46C1; border-radius: 10px;">
                    <h2 style="color: #6B46C1; text-align: center;">🎉 ¡Sistema Configurado Correctamente!</h2>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3>✅ Configuración Verificada:</h3>
                        <ul>
                            <li>📧 Email: ${CONFIG.email.user}</li>
                            <li>💳 MercadoPago: Credenciales configuradas</li>
                            <li>📁 Google Drive: ${CONFIG.googleDrive}</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${CONFIG.googleDrive}" style="background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px;">
                            📂 ACCEDER A LA BIBLIOTECA
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        Este es un email de prueba para verificar que tu sistema está funcionando correctamente.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(testEmail);
        console.log('   ✅ Email de prueba enviado exitosamente');
        console.log('   📧 Revisa tu bandeja de entrada:', CONFIG.email.user);
        return true;
    } catch (error) {
        console.log('   ❌ Error enviando email de prueba:', error.message);
        return false;
    }
}

// ===== EJECUTAR TODAS LAS PRUEBAS =====
async function runAllTests() {
    console.log('🚀 SISTEMA DE PRUEBAS - SANANDO CON CARTAS');
    console.log('==========================================\n');

    const results = {
        email: await testEmailConfig(),
        mercadopago: await testMercadoPagoConfig(),
        googleDrive: await testGoogleDriveConfig(),
        emailSending: false
    };

    // Solo probar envío si la configuración básica funciona
    if (results.email) {
        results.emailSending = await testEmailSending();
    }

    // Resumen final
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('====================');
    console.log(`📧 Configuración Email: ${results.email ? '✅' : '❌'}`);
    console.log(`💳 MercadoPago: ${results.mercadopago ? '✅' : '❌'}`);
    console.log(`📁 Google Drive: ${results.googleDrive ? '✅' : '❌'}`);
    console.log(`📤 Envío de Email: ${results.emailSending ? '✅' : '❌'}`);

    const allPassed = Object.values(results).every(result => result === true);
    
    if (allPassed) {
        console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON!');
        console.log('Tu sistema está listo para vender automáticamente.');
        console.log('\n🔥 PRÓXIMOS PASOS:');
        console.log('1. Ejecuta: node backend-config.js');
        console.log('2. Abre tu página web');
        console.log('3. ¡Comienza a vender!');
    } else {
        console.log('\n⚠️  ALGUNAS PRUEBAS FALLARON');
        console.log('Revisa las configuraciones marcadas con ❌');
    }

    return allPassed;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = { runAllTests, CONFIG };
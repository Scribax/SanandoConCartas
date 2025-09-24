// Configuración completa del Backend - Sanando Con Cartas
// Este archivo contiene toda la configuración necesaria para el servidor

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'null'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('./'));

// ===== CONFIGURACIÓN DE CREDENCIALES =====

const CONFIG = {
    // Email Configuration (Gmail)
    email: {
        service: 'gmail',
        auth: {
            user: 'bostonstock2025@gmail.com',
            pass: 'ppgt nhfg nbgz oepx' // App Password de Gmail
        },
        from: 'bostonstock2025@gmail.com'
    },

    // MercadoPago Configuration
    mercadopago: {
        access_token: 'APP_USR-2823973966774541-070800-09828874bdf313cfa30a5c8f334e7f9b-305616995',
        webhook_secret: 'TU_WEBHOOK_SECRET', // Opcional para mayor seguridad
        public_key: 'APP_USR-82a9259a-1964-4bbe-a4c4-8ab50745ba4d'
    },

    // Google Drive Configuration
    googleDrive: {
        folderLink: 'https://drive.google.com/drive/folders/1QuJYZSicxy8Sd1V-jl42lGKSU43_UOAh?usp=sharing'
    },

    // Course Information
    course: {
        title: 'Mega Biblioteca de Tarot - Sanando Con Cartas',
        price: 2500,
        currency: 'ARS',
        description: 'La biblioteca de tarot más completa: +50 cursos, +60 libros y +170 mazos digitales'
    },

    // Admin Configuration
    admin: {
        email: 'bostonstock2025@gmail.com',
        notifications: true
    }
};

// ===== CONFIGURACIÓN DE NODEMAILER =====

const transporter = nodemailer.createTransport({
    service: CONFIG.email.service,
    auth: CONFIG.email.auth
});

// Test de conexión del email
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error en configuración de email:', error);
    } else {
        console.log('✅ Email configurado correctamente');
    }
});

// ===== FUNCIONES DE EMAIL =====

async function sendCourseDeliveryEmail(customerData) {
    const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; background: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; line-height: 1.6; }
            .button { display: inline-block; background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .highlight-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .content-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔮 ¡Bienvenido a Sanando Con Cartas!</h1>
                <p>Tu Mega Biblioteca de Tarot está lista</p>
            </div>
            <div class="content">
                <h2>¡Hola ${customerData.name}!</h2>
                <p>¡Felicitaciones por tu compra! Tu pago ha sido procesado exitosamente y ahora tienes acceso completo a nuestra Mega Biblioteca de Tarot.</p>
                
                <div class="content-list">
                    <h3>🎉 Lo que incluye tu compra:</h3>
                    <ul>
                        <li>✅ <strong>+50 Cursos Profesionales de Tarot</strong></li>
                        <li>✅ <strong>+60 Libros Especializados</strong></li>
                        <li>✅ <strong>+170 Mazos y Oráculos Digitales</strong></li>
                        <li>✅ <strong>Acceso de por vida</strong></li>
                        <li>✅ <strong>Todas las actualizaciones futuras GRATIS</strong></li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${CONFIG.googleDrive.folderLink}" class="button" style="color: white; text-decoration: none;">
                        📂 ACCEDER A TU BIBLIOTECA COMPLETA
                    </a>
                </div>

                <div class="highlight-box">
                    <h4>📌 Instrucciones importantes:</h4>
                    <ol>
                        <li>Haz clic en el botón de arriba para acceder a tu biblioteca</li>
                        <li><strong>Guarda este email y el link en un lugar seguro</strong></li>
                        <li>Puedes descargar todo el contenido a tu dispositivo</li>
                        <li>El acceso es de por vida, no expira nunca</li>
                        <li>Comparte con responsabilidad, este contenido tiene mucho valor</li>
                    </ol>
                </div>

                <h3>🎯 Cómo aprovechar tu biblioteca:</h3>
                <p>Te recomendamos comenzar por:</p>
                <ul>
                    <li>📚 Los cursos básicos si eres principiante</li>
                    <li>🔮 Los libros de interpretación para profundizar</li>
                    <li>🎴 Descargar los mazos que más te llamen la atención</li>
                </ul>

                <h3>📱 ¿Necesitas ayuda?</h3>
                <p>Si tienes alguna pregunta o problema para acceder, contáctanos:</p>
                <ul>
                    <li>📧 <strong>Email:</strong> ${CONFIG.admin.email}</li>
                    <li>📱 <strong>WhatsApp:</strong> +54 9 11 1234-5678 (opcional)</li>
                </ul>

                <hr style="margin: 30px 0; border: none; height: 1px; background: #eee;">
                
                <p><small><strong>ID de Compra:</strong> ${customerData.paymentId}</small></p>
                <p><small><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</small></p>
            </div>
            <div class="footer">
                <p>Gracias por elegir Sanando Con Cartas para tu crecimiento espiritual 🙏</p>
                <p>© 2024 Sanando Con Cartas. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Sanando Con Cartas 🔮" <${CONFIG.email.from}>`,
        to: customerData.email,
        subject: '🔮 ¡Tu Mega Biblioteca de Tarot está lista! - Acceso inmediato',
        html: emailTemplate
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email de curso enviado exitosamente:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        throw error;
    }
}

async function sendAdminNotification(customerData) {
    const adminTemplate = `
        <h2>🎉 Nueva venta realizada!</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif;">
            <p><strong>Cliente:</strong> ${customerData.name}</p>
            <p><strong>Email:</strong> ${customerData.email}</p>
            <p><strong>Monto:</strong> $${customerData.amount} ${CONFIG.course.currency}</p>
            <p><strong>ID de Pago:</strong> ${customerData.paymentId}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            <p><strong>Estado:</strong> ${customerData.status}</p>
        </div>
        <p>El curso fue entregado automáticamente al cliente.</p>
    `;

    const mailOptions = {
        from: CONFIG.email.from,
        to: CONFIG.admin.email,
        subject: '🎉 Nueva venta - Mega Biblioteca de Tarot',
        html: adminTemplate
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Notificación enviada al admin');
    } catch (error) {
        console.error('❌ Error enviando notificación al admin:', error);
    }
}

// ===== ENDPOINTS DEL SERVIDOR =====

// Ruta raíz - servir index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Endpoint para crear preferencia de pago
app.post('/api/create-preference', async (req, res) => {
    try {
        const { items, payer } = req.body;
        
        const baseUrl = 'http://localhost:3000'; // Forzar localhost para desarrollo
        
        const preferenceData = {
            items: [{
                title: 'Mega Biblioteca de Tarot - Sanando Con Cartas',
                unit_price: 2500,
                quantity: 1,
                currency_id: 'ARS'
            }],
            back_urls: {
                success: baseUrl + '/success.html',
                failure: baseUrl + '/failure.html',
                pending: baseUrl + '/success.html'
            },
            auto_return: 'approved',
            notification_url: baseUrl + '/webhook/mercadopago'
        };

        console.log('📝 Creando preferencia con datos:', JSON.stringify(preferenceData, null, 2));
        
        // Crear preferencia en MercadoPago
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.mercadopago.access_token}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': 'TAROT-' + Date.now() + '-' + Math.random(),
                'User-Agent': 'SanandoConCartas/1.0'
            },
            body: JSON.stringify(preferenceData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('MercadoPago error details:', errorText);
            throw new Error(`MercadoPago API error: ${response.status} - ${errorText}`);
        }

        const preference = await response.json();
        
        res.json({ 
            preference_id: preference.id,
            init_point: preference.init_point,
            sandbox_init_point: preference.sandbox_init_point
        });
        
    } catch (error) {
        console.error('❌ Error creando preferencia:', error);
        res.status(500).json({ error: 'Error creando preferencia de pago' });
    }
});

// Webhook de MercadoPago
app.post('/webhook/mercadopago', async (req, res) => {
    try {
        console.log('📥 Webhook recibido:', req.body);

        // Verificar que es una notificación de pago
        if (req.body.type !== 'payment') {
            return res.status(200).send('OK');
        }

        const paymentId = req.body.data.id;
        
        // Obtener detalles del pago desde MercadoPago
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${CONFIG.mercadopago.access_token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error obteniendo detalles del pago');
        }

        const paymentData = await response.json();
        console.log('💳 Detalles del pago:', paymentData);

        // Verificar que el pago esté aprobado
        if (paymentData.status === 'approved') {
            const customerData = {
                name: paymentData.payer.first_name + ' ' + paymentData.payer.last_name,
                email: paymentData.payer.email,
                paymentId: paymentData.id,
                amount: paymentData.transaction_amount,
                status: paymentData.status
            };

            // Enviar el curso al cliente
            await sendCourseDeliveryEmail(customerData);
            
            // Notificar al admin
            if (CONFIG.admin.notifications) {
                await sendAdminNotification(customerData);
            }

            console.log('✅ Curso entregado exitosamente');
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        res.status(500).send('Error procesando webhook');
    }
});

// Endpoint de prueba para envío manual
app.post('/test/send-course', async (req, res) => {
    try {
        const { email, name = 'Cliente de Prueba' } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        const testCustomerData = {
            name: name,
            email: email,
            paymentId: 'TEST_' + Date.now(),
            amount: CONFIG.course.price,
            status: 'approved'
        };

        await sendCourseDeliveryEmail(testCustomerData);
        
        res.json({ 
            success: true, 
            message: 'Email de prueba enviado exitosamente',
            recipient: email 
        });
    } catch (error) {
        console.error('❌ Error en envío de prueba:', error);
        res.status(500).json({ error: 'Error enviando email de prueba' });
    }
});

// Endpoint de estado
app.get('/status', (req, res) => {
    res.json({
        status: 'active',
        service: 'Sanando Con Cartas - Backend',
        timestamp: new Date().toISOString(),
        config: {
            emailConfigured: !!CONFIG.email.auth.user,
            mercadopagoConfigured: !!CONFIG.mercadopago.access_token,
            adminNotifications: CONFIG.admin.notifications
        }
    });
});

// ===== INICIAR SERVIDOR =====

app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado exitosamente');
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`📧 Email configurado: ${CONFIG.email.auth.user}`);
    console.log(`💳 MercadoPago: ${CONFIG.mercadopago.access_token ? 'Configurado' : 'Pendiente'}`);
    console.log('🔗 Endpoints disponibles:');
    console.log('   POST /webhook/mercadopago - Webhook de MercadoPago');
    console.log('   POST /test/send-course - Envío de prueba');
    console.log('   GET /status - Estado del sistema');
});

module.exports = { app, CONFIG };
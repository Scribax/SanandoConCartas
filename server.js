// Backend Server para Sanando Con Cartas
// Este servidor maneja webhooks de MercadoPago y la entrega automatizada del curso

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos

// Configuración de email (usando Gmail como ejemplo)
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bostonstock2025@gmail.com',
        pass: 'ppgt nhfg nbgz oepx'
    }
});

// También puedes usar servicios profesionales como SendGrid:
/*
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
*/

// Base de datos simple (en producción usar PostgreSQL, MySQL, etc.)
const Database = {
    purchases: new Map(),
    
    // Guardar compra
    savePurchase(purchaseData) {
        this.purchases.set(purchaseData.payment_id, {
            ...purchaseData,
            created_at: new Date().toISOString()
        });
        console.log(`💾 Purchase saved: ${purchaseData.payment_id}`);
    },
    
    // Obtener compra
    getPurchase(paymentId) {
        return this.purchases.get(paymentId);
    },
    
    // Verificar si ya se entregó
    isAlreadyDelivered(paymentId) {
        const purchase = this.getPurchase(paymentId);
        return purchase && purchase.delivered === true;
    },
    
    // Marcar como entregado
    markAsDelivered(paymentId, deliveryData) {
        const purchase = this.getPurchase(paymentId);
        if (purchase) {
            purchase.delivered = true;
            purchase.delivered_at = new Date().toISOString();
            purchase.delivery_method = deliveryData.method;
            purchase.delivery_details = deliveryData.details;
        }
    }
};

// Configuración del curso (Google Drive)
const COURSE_CONFIG = {
    driveLink: 'https://drive.google.com/drive/folders/1QuJYZSicxy8Sd1V-jl42lGKSU43_UOAh?usp=sharing',
    courseName: 'Mega Biblioteca de Tarot - Sanando Con Cartas',
    supportEmail: 'bostonstock2025@gmail.com',
    adminEmail: 'bostonstock2025@gmail.com'
};

// WEBHOOK DE MERCADOPAGO
app.post('/webhook', async (req, res) => {
    try {
        console.log('📧 Webhook received:', req.body);

        const { type, action, data } = req.body;

        // Solo procesar notificaciones de pago
        if (type !== 'payment') {
            console.log('⏭️ Skipping non-payment notification');
            return res.status(200).send('OK');
        }

        const paymentId = data.id;

        // Verificar si ya se entregó este pago
        if (Database.isAlreadyDelivered(paymentId)) {
            console.log('✅ Payment already processed:', paymentId);
            return res.status(200).send('Already processed');
        }

        // Obtener detalles del pago de MercadoPago
        const paymentDetails = await getPaymentFromMercadoPago(paymentId);
        
        if (!paymentDetails) {
            console.log('❌ Could not get payment details for:', paymentId);
            return res.status(400).send('Payment not found');
        }

        console.log('💳 Payment details:', {
            id: paymentDetails.id,
            status: paymentDetails.status,
            email: paymentDetails.payer?.email
        });

        // Solo procesar pagos aprobados
        if (paymentDetails.status !== 'approved') {
            console.log('⏳ Payment not approved yet:', paymentDetails.status);
            return res.status(200).send('Payment not approved');
        }

        // Extraer datos del comprador
        const purchaseData = {
            payment_id: paymentDetails.id,
            payer_email: paymentDetails.payer.email,
            payer_name: `${paymentDetails.payer.first_name} ${paymentDetails.payer.last_name}`.trim(),
            amount: paymentDetails.transaction_amount,
            currency: paymentDetails.currency_id,
            status: paymentDetails.status,
            payment_method: paymentDetails.payment_method_id
        };

        // Guardar en base de datos
        Database.savePurchase(purchaseData);

        // Enviar curso al cliente
        await deliverCourse(purchaseData);

        // Notificar al administrador
        await notifyAdminOfSale(purchaseData);

        // Marcar como entregado
        Database.markAsDelivered(paymentId, {
            method: 'google_drive',
            details: { link: COURSE_CONFIG.driveLink }
        });

        console.log('✅ Course delivered successfully for:', purchaseData.payer_email);
        res.status(200).send('Course delivered');

    } catch (error) {
        console.error('❌ Webhook error:', error);
        
        // Notificar error al administrador
        await notifyAdminOfError(error, req.body);
        
        res.status(500).send('Internal error');
    }
});

// Función para obtener pago de MercadoPago
async function getPaymentFromMercadoPago(paymentId) {
    try {
        const fetch = require('node-fetch');
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`MercadoPago API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting payment from MercadoPago:', error);
        return null;
    }
}

// Función para entregar el curso
async function deliverCourse(purchaseData) {
    const emailHtml = generateCourseEmailTemplate(purchaseData);

    const mailOptions = {
        from: `"Sanando Con Cartas" <${process.env.EMAIL_USER}>`,
        to: purchaseData.payer_email,
        subject: '🔮 ¡Tu Mega Biblioteca de Tarot está lista!',
        html: emailHtml
    };

    try {
        const result = await emailTransporter.sendMail(mailOptions);
        console.log('📧 Course email sent to:', purchaseData.payer_email);
        return result;
    } catch (error) {
        console.error('Error sending course email:', error);
        throw error;
    }
}

// Template de email para el curso
function generateCourseEmailTemplate(purchaseData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%); color: white; padding: 18px 36px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; margin: 20px 0; }
            .highlight-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .footer { background: #f8f9fa; padding: 25px; text-align: center; color: #666; }
            .stats { display: flex; justify-content: space-around; background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-number { font-size: 24px; font-weight: bold; color: #6B46C1; }
            .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            ul li { margin: 8px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔮 ¡Bienvenido a Sanando Con Cartas!</h1>
                <p style="font-size: 18px; margin: 10px 0 0 0;">Tu Mega Biblioteca de Tarot está lista</p>
            </div>
            
            <div class="content">
                <h2>¡Hola ${purchaseData.payer_name}!</h2>
                
                <p style="font-size: 16px; line-height: 1.6;">
                    ¡Felicitaciones por tu compra! Tu pago de <strong>$${purchaseData.amount} ${purchaseData.currency}</strong> 
                    ha sido procesado exitosamente y ahora tienes acceso completo a nuestra Mega Biblioteca de Tarot.
                </p>

                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">+50</div>
                        <div class="stat-label">CURSOS</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">+60</div>
                        <div class="stat-label">LIBROS</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">+170</div>
                        <div class="stat-label">MAZOS</div>
                    </div>
                </div>

                <h3>🎉 Lo que incluye tu compra:</h3>
                <ul style="line-height: 1.8;">
                    <li>✅ <strong>+50 Cursos Profesionales</strong> de Tarot (Rider-Waite, Marsella, y más)</li>
                    <li>✅ <strong>+60 Libros Especializados</strong> de los mejores autores internacionales</li>
                    <li>✅ <strong>+170 Mazos y Oráculos</strong> digitales descargables</li>
                    <li>✅ <strong>Oráculos angelicales</strong>, Flores de Bach, Gaia y muchísimo más</li>
                    <li>✅ <strong>Acceso de por vida</strong> - sin vencimientos ni suscripciones</li>
                    <li>✅ <strong>Todas las actualizaciones futuras</strong> incluidas</li>
                </ul>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="${COURSE_CONFIG.driveLink}" class="button" style="color: white;">
                        📂 ACCEDER A TU BIBLIOTECA COMPLETA
                    </a>
                </div>

                <div class="highlight-box">
                    <h4>📌 Instrucciones importantes:</h4>
                    <ol style="line-height: 1.6;">
                        <li><strong>Haz clic en el botón de arriba</strong> para acceder a tu biblioteca</li>
                        <li><strong>Guarda este email</strong> en un lugar seguro como respaldo</li>
                        <li><strong>Descarga todo el contenido</strong> a tu dispositivo cuando quieras</li>
                        <li><strong>El acceso es de por vida</strong>, nunca expira</li>
                        <li><strong>Puedes acceder</strong> desde cualquier dispositivo con internet</li>
                    </ol>
                </div>

                <h3>🎓 ¿Cómo empezar?</h3>
                <p style="line-height: 1.6;">
                    Te recomendamos comenzar con los <strong>cursos básicos</strong> si eres principiante, 
                    o ir directamente a los <strong>cursos avanzados</strong> si ya tienes experiencia. 
                    Todos los materiales están organizados por categorías para que encuentres fácilmente lo que necesitas.
                </p>

                <h3>📱 ¿Necesitas ayuda?</h3>
                <p>Si tienes alguna pregunta o problema para acceder, contáctanos de inmediato:</p>
                <ul>
                    <li>📧 <strong>Email:</strong> ${COURSE_CONFIG.supportEmail}</li>
                    <li>📱 <strong>WhatsApp:</strong> +54 9 11 1234-5678</li>
                    <li>⏰ <strong>Horario:</strong> Lunes a Viernes 9:00 - 18:00 hs</li>
                </ul>

                <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 25px 0;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>📄 Datos de tu compra:</strong><br>
                        ID de Pago: <code>${purchaseData.payment_id}</code><br>
                        Fecha: ${new Date().toLocaleDateString('es-ES')}<br>
                        Método: ${purchaseData.payment_method}
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p style="font-size: 16px; margin-bottom: 10px;">
                    <strong>Gracias por elegir Sanando Con Cartas para tu crecimiento espiritual 🙏</strong>
                </p>
                <p style="margin: 5px 0;">© 2024 Sanando Con Cartas. Todos los derechos reservados.</p>
                <p style="margin: 5px 0; font-size: 12px;">
                    Este email contiene información confidencial. Si lo recibiste por error, por favor elimínalo.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Notificar nueva venta al administrador
async function notifyAdminOfSale(purchaseData) {
    const adminEmailHtml = `
        <h2>🎉 Nueva venta realizada</h2>
        <p><strong>Cliente:</strong> ${purchaseData.payer_name}</p>
        <p><strong>Email:</strong> ${purchaseData.payer_email}</p>
        <p><strong>Monto:</strong> $${purchaseData.amount} ${purchaseData.currency}</p>
        <p><strong>Método de pago:</strong> ${purchaseData.payment_method}</p>
        <p><strong>ID de Pago:</strong> ${purchaseData.payment_id}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <p><strong>Estado:</strong> ✅ Curso entregado automáticamente</p>
    `;

    const mailOptions = {
        from: `"Sistema Sanando Con Cartas" <${process.env.EMAIL_USER}>`,
        to: COURSE_CONFIG.adminEmail,
        subject: '🎉 Nueva venta - Mega Biblioteca de Tarot',
        html: adminEmailHtml
    };

    try {
        await emailTransporter.sendMail(mailOptions);
        console.log('📧 Admin notified of sale');
    } catch (error) {
        console.error('Error notifying admin of sale:', error);
    }
}

// Notificar error al administrador
async function notifyAdminOfError(error, webhookData) {
    const errorEmailHtml = `
        <h2>❌ Error en el sistema de entrega</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong> <pre>${error.stack}</pre></p>
        <p><strong>Webhook Data:</strong> <pre>${JSON.stringify(webhookData, null, 2)}</pre></p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Acción requerida:</strong> Revisar y entregar manualmente si es necesario.</p>
    `;

    const mailOptions = {
        from: `"Sistema Sanando Con Cartas" <${process.env.EMAIL_USER}>`,
        to: COURSE_CONFIG.adminEmail,
        subject: '❌ ERROR: Sistema de entrega de curso',
        html: errorEmailHtml
    };

    try {
        await emailTransporter.sendMail(mailOptions);
    } catch (emailError) {
        console.error('Failed to notify admin of error:', emailError);
    }
}

// ENDPOINT PARA ENTREGA MANUAL
app.post('/manual-delivery', async (req, res) => {
    try {
        const { email, paymentId, name } = req.body;

        if (!email || !paymentId) {
            return res.status(400).json({ error: 'Email and paymentId are required' });
        }

        const purchaseData = {
            payment_id: paymentId,
            payer_email: email,
            payer_name: name || 'Cliente',
            amount: 2500,
            currency: 'ARS',
            manual_delivery: true
        };

        await deliverCourse(purchaseData);

        Database.markAsDelivered(paymentId, {
            method: 'manual_delivery',
            details: { delivered_by: 'admin' }
        });

        res.json({ success: true, message: 'Course delivered manually' });

    } catch (error) {
        console.error('Manual delivery error:', error);
        res.status(500).json({ error: 'Failed to deliver course manually' });
    }
});

// ENDPOINT PARA VER ESTADO DE COMPRAS
app.get('/purchases', (req, res) => {
    const purchases = Array.from(Database.purchases.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(purchases);
});

// ENDPOINT PARA TESTEAR EMAIL
app.post('/test-email', async (req, res) => {
    try {
        const testPurchaseData = {
            payment_id: 'TEST_' + Date.now(),
            payer_email: req.body.email || 'test@example.com',
            payer_name: 'Usuario de Prueba',
            amount: 2500,
            currency: 'ARS',
            payment_method: 'credit_card'
        };

        await deliverCourse(testPurchaseData);
        res.json({ success: true, message: 'Test email sent' });

    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ error: 'Failed to send test email' });
    }
});

// Servir archivos estáticos
app.use(express.static('.'));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Webhook URL: http://localhost:${PORT}/webhook`);
    console.log(`🔧 Manual delivery: http://localhost:${PORT}/manual-delivery`);
    console.log(`📊 View purchases: http://localhost:${PORT}/purchases`);
});

module.exports = app;
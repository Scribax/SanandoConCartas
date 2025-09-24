// Sistema de Entrega Automatizada del Curso - Sanando Con Cartas
// Este sistema maneja la entrega del curso después del pago exitoso

const CourseDeliverySystem = {
    // Configuración del sistema
    config: {
        apiBaseUrl: '/api', // Tu servidor backend
        courseId: 'mega-biblioteca-tarot',
        supportEmail: 'bostonstock2025@gmail.com',
        courseTitle: 'Mega Biblioteca de Tarot - Sanando Con Cartas'
    },

    // OPCIÓN 1: Sistema de Membresía Propio (RECOMENDADO)
    membershipSystem: {
        // Crear acceso personalizado después del pago
        async createCourseAccess(paymentData) {
            try {
                const accessData = {
                    payment_id: paymentData.payment_id,
                    user_email: paymentData.payer_email,
                    user_name: paymentData.payer_name,
                    purchase_date: new Date().toISOString(),
                    course_id: this.config.courseId,
                    access_token: this.generateUniqueToken(),
                    expires_at: null // Acceso de por vida
                };

                // Enviar datos al backend para crear el acceso
                const response = await fetch(`${this.config.apiBaseUrl}/create-course-access`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.API_SECRET}`
                    },
                    body: JSON.stringify(accessData)
                });

                if (response.ok) {
                    const result = await response.json();
                    await this.sendWelcomeEmail(result);
                    return result;
                } else {
                    throw new Error('Error creating course access');
                }

            } catch (error) {
                console.error('Error in createCourseAccess:', error);
                await this.handleDeliveryError(paymentData, error);
                throw error;
            }
        },

        // Generar token único para cada usuario
        generateUniqueToken() {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const hash = btoa(`${timestamp}-${random}`);
            return `scc_${hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`;
        },

        // Enviar email de bienvenida con acceso al curso
        async sendWelcomeEmail(accessData) {
            const courseUrl = `https://tu-dominio.com/curso?token=${accessData.access_token}`;
            
            const emailData = {
                to: accessData.user_email,
                subject: '🔮 ¡Bienvenido a la Mega Biblioteca de Tarot!',
                template: 'course_welcome',
                data: {
                    user_name: accessData.user_name || 'Estudiante',
                    course_title: this.config.courseTitle,
                    course_url: courseUrl,
                    access_token: accessData.access_token,
                    support_email: this.config.supportEmail,
                    purchase_date: new Date(accessData.purchase_date).toLocaleDateString('es-ES'),
                    payment_id: accessData.payment_id
                }
            };

            return await this.sendEmail(emailData);
        }
    },

    // OPCIÓN 2: Google Drive con Links Únicos
    driveSystem: {
        // Configuración de Google Drive
        driveConfig: {
            // Aquí irían tus carpetas organizadas
            folders: {
                cursos: 'ID_CARPETA_CURSOS',
                libros: 'ID_CARPETA_LIBROS', 
                mazos: 'ID_CARPETA_MAZOS'
            },
            // Link principal de la carpeta (con permisos de visualización)
            mainFolderLink: 'https://drive.google.com/drive/folders/1QuJYZSicxy8Sd1V-jl42lGKSU43_UOAh?usp=sharing'
        },

        // Crear acceso a Google Drive
        async createDriveAccess(paymentData) {
            try {
                // Opción A: Link directo (más simple pero menos seguro)
                await this.sendDriveAccessEmail(paymentData, this.driveConfig.mainFolderLink);
                
                // Opción B: Dar permisos específicos al email (más seguro)
                // await this.grantDrivePermissions(paymentData.payer_email);
                
                return {
                    success: true,
                    access_method: 'google_drive',
                    folder_link: this.driveConfig.mainFolderLink
                };

            } catch (error) {
                console.error('Error in createDriveAccess:', error);
                throw error;
            }
        },

        // Enviar email con acceso a Google Drive
        async sendDriveAccessEmail(paymentData, driveLink) {
            const emailData = {
                to: paymentData.payer_email,
                subject: '🔮 ¡Tu Mega Biblioteca de Tarot está lista!',
                html: this.generateDriveEmailTemplate({
                    user_name: paymentData.payer_name || 'Estudiante',
                    drive_link: driveLink,
                    payment_id: paymentData.payment_id
                })
            };

            return await CourseDeliverySystem.sendEmail(emailData);
        },

        // Template de email para Google Drive
        generateDriveEmailTemplate(data) {
            return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; background: #f9fafb; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .button { display: inline-block; background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
                    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔮 ¡Bienvenido a Sanando Con Cartas!</h1>
                        <p>Tu Mega Biblioteca de Tarot está lista</p>
                    </div>
                    <div class="content">
                        <h2>¡Hola ${data.user_name}!</h2>
                        <p>¡Felicitaciones por tu compra! Tu pago ha sido procesado exitosamente y ahora tienes acceso completo a nuestra Mega Biblioteca de Tarot.</p>
                        
                        <h3>🎉 Lo que incluye tu compra:</h3>
                        <ul>
                            <li>✅ +50 Cursos Profesionales de Tarot</li>
                            <li>✅ +60 Libros Especializados</li>
                            <li>✅ +170 Mazos y Oráculos Digitales</li>
                            <li>✅ Acceso de por vida</li>
                            <li>✅ Todas las actualizaciones futuras</li>
                        </ul>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${data.drive_link}" class="button" style="color: white;">
                                📂 ACCEDER A TU BIBLIOTECA COMPLETA
                            </a>
                        </div>

                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h4>📌 Instrucciones importantes:</h4>
                            <ol>
                                <li>Haz clic en el botón de arriba para acceder a tu biblioteca</li>
                                <li>Guarda este email y el link en un lugar seguro</li>
                                <li>Puedes descargar todo el contenido a tu dispositivo</li>
                                <li>El acceso es de por vida, no expira nunca</li>
                            </ol>
                        </div>

                        <h3>📱 ¿Necesitas ayuda?</h3>
                        <p>Si tienes alguna pregunta o problema para acceder, contáctanos:</p>
                        <ul>
                            <li>📧 Email: bostonstock2025@gmail.com</li>
                            <li>📱 WhatsApp: +54 9 11 1234-5678</li>
                        </ul>

                        <p><strong>ID de Compra:</strong> ${data.payment_id}</p>
                    </div>
                    <div class="footer">
                        <p>Gracias por elegir Sanando Con Cartas para tu crecimiento espiritual 🙏</p>
                        <p>© 2024 Sanando Con Cartas. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            `;
        }
    },

    // Sistema de envío de emails
    async sendEmail(emailData) {
        try {
            // Opción A: Usando un servicio como SendGrid, Mailgun, etc.
            const response = await fetch(`${this.config.apiBaseUrl}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                throw new Error(`Email sending failed: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error sending email:', error);
            
            // Fallback: Enviar notificación al administrador
            await this.notifyAdminOfFailure(emailData, error);
            throw error;
        }
    },

    // Manejar el webhook de MercadoPago
    async handlePaymentWebhook(webhookData) {
        try {
            console.log('Processing payment webhook:', webhookData);

            // Verificar que el pago está aprobado
            if (webhookData.type !== 'payment' || webhookData.action !== 'payment.updated') {
                return { success: false, reason: 'Not a payment update' };
            }

            // Obtener detalles del pago desde MercadoPago
            const paymentDetails = await this.getPaymentDetails(webhookData.data.id);
            
            if (paymentDetails.status !== 'approved') {
                console.log('Payment not approved yet:', paymentDetails.status);
                return { success: false, reason: 'Payment not approved' };
            }

            // Extraer datos del comprador
            const paymentData = {
                payment_id: paymentDetails.id,
                payer_email: paymentDetails.payer.email,
                payer_name: paymentDetails.payer.first_name + ' ' + paymentDetails.payer.last_name,
                amount: paymentDetails.transaction_amount,
                status: paymentDetails.status
            };

            // Entregar el curso usando el sistema elegido
            let deliveryResult;
            
            // Cambiar esta línea para elegir el sistema:
            // deliveryResult = await this.membershipSystem.createCourseAccess(paymentData); // Opción 1
            deliveryResult = await this.driveSystem.createDriveAccess(paymentData); // Opción 2

            console.log('Course delivered successfully:', deliveryResult);

            // Notificar al administrador
            await this.notifyAdminOfSale(paymentData);

            return { success: true, delivery: deliveryResult };

        } catch (error) {
            console.error('Error in handlePaymentWebhook:', error);
            await this.handleDeliveryError(webhookData, error);
            return { success: false, error: error.message };
        }
    },

    // Obtener detalles del pago desde MercadoPago
    async getPaymentDetails(paymentId) {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get payment details: ${response.statusText}`);
        }

        return await response.json();
    },

    // Notificar al administrador de una nueva venta
    async notifyAdminOfSale(paymentData) {
        const adminEmailData = {
        to: 'bostonstock2025@gmail.com', // Tu email
            subject: '🎉 Nueva venta - Mega Biblioteca de Tarot',
            html: `
                <h2>¡Nueva venta realizada!</h2>
                <p><strong>Cliente:</strong> ${paymentData.payer_name}</p>
                <p><strong>Email:</strong> ${paymentData.payer_email}</p>
                <p><strong>Monto:</strong> $${paymentData.amount}</p>
                <p><strong>ID de Pago:</strong> ${paymentData.payment_id}</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            `
        };

        try {
            await this.sendEmail(adminEmailData);
        } catch (error) {
            console.error('Error notifying admin:', error);
        }
    },

    // Manejar errores en la entrega
    async handleDeliveryError(paymentData, error) {
        console.error('Course delivery failed:', error);
        
        // Notificar al administrador del problema
        const errorEmailData = {
            to: 'bostonstock2025@gmail.com',
            subject: '❌ ERROR: Falla en entrega de curso',
            html: `
                <h2>Error en la entrega del curso</h2>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><strong>Payment Data:</strong> ${JSON.stringify(paymentData, null, 2)}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <p>Revisa el sistema y entrega el curso manualmente.</p>
            `
        };

        try {
            await this.sendEmail(errorEmailData);
        } catch (emailError) {
            console.error('Failed to notify admin of delivery error:', emailError);
        }
    },

    // Función para entregar curso manualmente (para emergencias)
    async manualDelivery(email, paymentId) {
        try {
            const paymentData = {
                payment_id: paymentId,
                payer_email: email,
                payer_name: 'Cliente',
                manual_delivery: true
            };

            // Usar el sistema elegido
            const result = await this.driveSystem.createDriveAccess(paymentData);
            console.log('Manual delivery completed:', result);
            
            return result;
        } catch (error) {
            console.error('Manual delivery failed:', error);
            throw error;
        }
    }
};

// Funciones globales para usar en consola (testing)
window.CourseDeliverySystem = CourseDeliverySystem;

// Función de prueba para envío manual
window.testCourseDelivery = async function(email = 'test@example.com') {
    const testPaymentData = {
        payment_id: 'TEST_' + Date.now(),
        payer_email: email,
        payer_name: 'Usuario de Prueba',
        amount: 2500,
        status: 'approved'
    };

    try {
        const result = await CourseDeliverySystem.driveSystem.createDriveAccess(testPaymentData);
        console.log('✅ Test delivery successful:', result);
        return result;
    } catch (error) {
        console.error('❌ Test delivery failed:', error);
        return error;
    }
};

console.log('🚀 Course Delivery System loaded successfully!');
console.log('📝 Use testCourseDelivery("email@test.com") to test delivery');

export default CourseDeliverySystem;
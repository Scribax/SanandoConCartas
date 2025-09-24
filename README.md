# 🔮 Sanando Con Cartas - Mega Biblioteca de Tarot

**CONFIGURACIÓN PERSONALIZADA PARA: bostonstock2025@gmail.com**

Una página web profesional y hermosa para vender tu mega biblioteca de tarot con integración completa de MercadoPago y entrega automática.

## ✨ Características Configuradas

- **Diseño Profesional**: Interfaz moderna con carta "El Mago" personalizada
- **Entrega Automática**: Sistema configurado con Google Drive
- **Email Configurado**: bostonstock2025@gmail.com con contraseña de app
- **Google Drive**: Link configurado para entrega inmediata
- **Responsive Design**: Se adapta perfectamente a todos los dispositivos
- **Integración MercadoPago**: Procesamiento seguro de pagos
- **Sistema de Urgencia**: Contador regresivo de 24 horas
- **Animaciones Avanzadas**: Efectos visuales y transiciones suaves

## 📁 Estructura de Archivos

```
Sanando con cartas/
├── index.html              # Página principal
├── styles.css              # Estilos y animaciones
├── script.js               # JavaScript principal
├── mercadopago-integration.js # Integración con MercadoPago
├── success.html             # Página de pago exitoso
├── failure.html             # Página de error en pago
├── pending.html             # Página de pago pendiente (crear si es necesario)
└── README.md               # Este archivo
```

## 🚀 Configuración de MercadoPago

### Paso 1: Obtener las Credenciales

1. Crea una cuenta en [MercadoPago Developers](https://developers.mercadopago.com/)
2. Ve a "Tus aplicaciones" y crea una nueva aplicación
3. Obtén tu **Public Key** y **Access Token**

### Paso 2: Configurar el Frontend

1. Abre el archivo `mercadopago-integration.js`
2. Reemplaza `'YOUR_PUBLIC_KEY'` con tu Public Key real:

```javascript
const mp = new MercadoPago('APP_USR-tu-public-key-aqui', {
    locale: 'es-AR'
});
```

### Paso 3: Configurar el Backend (Requerido)

**IMPORTANTE**: Para producción, necesitas un backend que maneje la creación de preferencias de pago.

#### Crear endpoint `/api/create-preference` en tu servidor:

```javascript
// Ejemplo con Node.js y Express
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-tu-access-token-aqui'
});

app.post('/api/create-preference', async (req, res) => {
    try {
        const preference = {
            items: [
                {
                    title: 'Curso Completo de Tarot - Sanando Con Cartas',
                    unit_price: 2500,
                    quantity: 1,
                    currency_id: 'ARS'
                }
            ],
            back_urls: {
                success: 'https://tu-dominio.com/success.html',
                failure: 'https://tu-dominio.com/failure.html',
                pending: 'https://tu-dominio.com/pending.html'
            },
            auto_return: 'approved',
            notification_url: 'https://tu-dominio.com/webhook'
        };

        const response = await mercadopago.preferences.create(preference);
        res.json({ preference_id: response.body.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creando preferencia' });
    }
});
```

### Paso 4: Configurar Webhooks

Para recibir notificaciones de estado de pago, configura un endpoint webhook:

```javascript
app.post('/webhook', (req, res) => {
    const paymentId = req.query.id;
    const topic = req.query.topic;
    
    if (topic === 'payment') {
        // Verificar el estado del pago
        mercadopago.payment.findById(paymentId)
            .then(payment => {
                if (payment.body.status === 'approved') {
                    // Dar acceso al curso
                    grantCourseAccess(payment.body.payer.email);
                }
            });
    }
    
    res.status(200).send('OK');
});
```

## 🛠️ Personalización

### Cambiar Información de Contacto

1. **Número de WhatsApp**: Edita el número en los archivos JavaScript:
```javascript
const phoneNumber = '5491112345678'; // Reemplaza con tu número real
```

2. **Email de Contacto**: Actualiza en `index.html`:
```html
<a href="mailto:tu-email@dominio.com">tu-email@dominio.com</a>
```

### Modificar Contenido

- **Testimonios**: Edita la sección testimonios en `index.html`
- **Contenido del Curso**: Actualiza los módulos y características
- **Precios**: Cambia el precio en `mercadopago-integration.js`

### Personalizar Colores

Los colores están definidos en `styles.css` en las variables CSS:

```css
:root {
    --primary-color: #6B46C1;      /* Violeta principal */
    --secondary-color: #EC4899;     /* Rosa secundario */
    --accent-color: #F59E0B;        /* Dorado */
    /* ... más colores */
}
```

## 🌐 Deploy

### Opciones de Hosting

1. **Netlify** (Recomendado para principiantes)
2. **Vercel**
3. **GitHub Pages**
4. **Hosting tradicional con cPanel**

### Configuración DNS

Una vez que tengas el hosting, configura tu dominio y actualiza las URLs en:
- `mercadopago-integration.js` (back_urls)
- Meta tags de redes sociales en `index.html`

## 📊 Analytics y Tracking

### Google Analytics

Agrega tu código de Google Analytics antes de `</head>`:

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Facebook Pixel

Agrega el código del Pixel de Facebook para tracking de conversiones:

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

## 🔒 Seguridad

### Validaciones Importantes

1. **Backend**: Siempre crea las preferencias en el servidor
2. **Webhooks**: Valida las notificaciones de MercadoPago
3. **HTTPS**: Usa siempre HTTPS en producción
4. **CORS**: Configura correctamente los CORS en tu backend

### Ejemplo de Validación de Webhook

```javascript
const crypto = require('crypto');

function validateWebhook(req) {
    const signature = req.headers['x-signature'];
    const requestId = req.headers['x-request-id'];
    const dataId = req.query['data.id'] || req.body.data.id;
    
    const hash = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(`${requestId}${dataId}`)
        .digest('hex');
    
    return hash === signature;
}
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **El botón de pago no funciona**:
   - Verifica que el Public Key esté configurado correctamente
   - Revisa la consola del navegador para errores

2. **Error 401 en MercadoPago**:
   - Verifica que las credenciales sean correctas
   - Asegúrate de usar las credenciales del entorno correcto (sandbox/producción)

3. **Webhooks no recibidos**:
   - Verifica que la URL sea accesible públicamente
   - Usa ngrok para desarrollo local
   - Revisa los logs de MercadoPago en el dashboard

### Modo de Prueba

Para probar pagos, usa las credenciales de sandbox y estos datos de tarjeta:

```
Tarjeta: 4509 9535 6623 3704
Vencimiento: 11/25
CVV: 123
Nombre: APRO (para aprobado)
DNI: 12345678
```

## 📞 Soporte

Si tienes problemas con la configuración:

1. Revisa la documentación oficial de [MercadoPago](https://developers.mercadopago.com/)
2. Verifica que todos los archivos estén en el directorio correcto
3. Usa las herramientas de desarrollador del navegador para debugear

## 🎯 Próximos Pasos

Una vez que tengas todo funcionando:

1. **Configura el backend** para manejar pagos reales
2. **Implementa el sistema de entrega** del curso
3. **Configura analytics** para tracking de conversiones
4. **Optimiza SEO** con contenido adicional
5. **Implementa email marketing** para seguimiento

¡Tu página web profesional para vender el curso de tarot está lista! 🔮✨
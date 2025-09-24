# 🚀 INSTRUCCIONES DE CONFIGURACIÓN - SANANDO CON CARTAS

**Tu email**: bostonstock2025@gmail.com  
**Contraseña de app Gmail**: ppgt nhfg nbgz oepx  
**Google Drive**: https://drive.google.com/drive/folders/1QuJYZSicxy8Sd1V-jl42lGKSU43_UOAh?usp=sharing

## ✅ LO QUE YA ESTÁ CONFIGURADO

### 🎨 **Frontend Completamente Listo**
- ✅ Página web principal con diseño profesional
- ✅ Carta "El Mago" personalizada integrada
- ✅ Contador regresivo de urgencia (24 horas)
- ✅ Todas las secciones optimizadas
- ✅ Animaciones y efectos visuales
- ✅ Responsive design para móviles

### 📧 **Sistema de Email Configurado**
- ✅ Gmail: bostonstock2025@gmail.com
- ✅ Contraseña de aplicación configurada
- ✅ Templates de email profesionales
- ✅ Entrega automática del curso

### 💾 **Sistema de Entrega**
- ✅ Google Drive configurado
- ✅ Link de acceso directo programado
- ✅ Email automático después del pago

## 🔧 LO QUE NECESITAS CONFIGURAR

### 1️⃣ **MERCADOPAGO** (✅ CONFIGURADO)

✅ **YA CONFIGURADO CON TUS CREDENCIALES REALES:**

```
Public Key: APP_USR-82a9259a-1964-4bbe-a4c4-8ab50745ba4d
Access Token: APP_USR-2823973966774541-070800-09828874bdf313cfa30a5c8f334e7f9b-305616995
```

✅ **Archivos actualizados:**
- ✅ `backend-config.js`
- ✅ `mercadopago-integration.js`
- ✅ `server.js`
- ✅ `.env`

### 2️⃣ **INSTALAR BACKEND** (OBLIGATORIO)

**Opción A: En tu computadora local (para pruebas)**
```bash
# 1. Instalar Node.js desde https://nodejs.org/
# 2. Abrir terminal en la carpeta del proyecto
# 3. Ejecutar:
npm install express nodemailer cors

# 4. Iniciar servidor:
node backend-config.js
```

**Opción B: En servidor web (para producción)**
- Sube todos los archivos a tu hosting
- Instala las dependencias de Node.js
- Configura el puerto y las URLs

### 3️⃣ **CONFIGURAR WEBHOOKS**

En tu cuenta de MercadoPago:
1. Ve a "Webhooks"
2. Agrega esta URL: `https://tu-dominio.com/webhook/mercadopago`
3. Selecciona eventos: "Payments"

## 🧪 CÓMO PROBAR EL SISTEMA

### 🎆 **PRUEBA AUTOMATIZADA (RECOMENDADO)**

```bash
# Ejecuta el script de prueba completo:
node test-config.js
```

**Esto verificará:**
- ✅ Configuración de email
- ✅ Credenciales de MercadoPago
- ✅ URL de Google Drive
- ✅ Envío de email real

### **Pruebas Manuales:**

**Prueba 1: Servidor Backend**
```bash
node backend-config.js
# Ve a: http://localhost:3000/status
```

**Prueba 2: Envío Manual**
```bash
curl -X POST http://localhost:3000/test/send-course \
  -H "Content-Type: application/json" \
  -d '{"email": "bostonstock2025@gmail.com", "name": "Prueba"}'
```

**Prueba 3: Compra Completa**
1. Abre `index.html` en tu navegador
2. Haz clic en "Obtener Curso Ahora"
3. Realiza una compra de prueba
4. Verifica el email automático

## 📁 ESTRUCTURA DE ARCHIVOS ACTUALIZADA

```
Sanando con cartas/
├── 🎨 FRONTEND
│   ├── index.html                    # Página principal ✅
│   ├── styles.css                    # Estilos ✅
│   ├── script.js                     # JavaScript principal ✅
│   ├── success.html                  # Página de éxito ✅
│   ├── failure.html                  # Página de error ✅
│   └── images/
│       ├── el-mago-hero.png          # Carta personalizada ✅
│       └── el-mago-original.jpg      # Carta original ✅
│
├── 💻 BACKEND
│   ├── backend-config.js             # Servidor principal ✅
│   ├── course-delivery-system.js     # Sistema de entrega ✅
│   └── mercadopago-integration.js    # Integración pagos ✅
│
├── 📚 DOCUMENTACIÓN
│   ├── README.md                     # Documentación general ✅
│   └── INSTRUCCIONES-CONFIGURACION.md # Este archivo ✅
```

## 🌐 DEPLOYMENT (PUBLICAR EN INTERNET)

### **Opción 1: Netlify (Fácil)**
1. Sube los archivos del frontend a Netlify
2. Despliega el backend en Railway, Heroku o Render
3. Actualiza las URLs en el código

### **Opción 2: Hosting tradicional**
1. Sube todos los archivos por FTP
2. Configura Node.js en tu cPanel
3. Instala las dependencias

### **Opción 3: VPS**
1. Alquila un servidor (DigitalOcean, AWS, etc.)
2. Instala Node.js y PM2
3. Configura nginx como proxy

## ❓ TROUBLESHOOTING

### **❌ No llegan los emails**
- Verifica la contraseña de app de Gmail
- Revisa la carpeta spam
- Comprueba la configuración en backend-config.js

### **❌ Error en MercadoPago**
- Verifica las credenciales (public key y access token)
- Asegúrate de usar el modo correcto (sandbox/production)
- Revisa que el webhook esté configurado

### **❌ El servidor no inicia**
- Instala las dependencias: `npm install express nodemailer cors`
- Verifica el puerto (3000 por defecto)
- Revisa los logs de error en la consola

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs en la consola del navegador (F12)
2. Verifica los logs del servidor
3. Comprueba que todas las credenciales estén correctas

## 🎯 PRÓXIMOS PASOS

1. **Configura MercadoPago** ← PRIORITARIO
2. **Instala el backend** ← OBLIGATORIO  
3. **Prueba el sistema completo**
4. **Publica en internet**
5. **¡Comienza a vender!** 🚀

---

**¿Todo listo?** Una vez configurado MercadoPago y el backend, tu sistema estará 100% funcional y automático. Los clientes podrán comprar y recibir el curso inmediatamente sin intervención manual.
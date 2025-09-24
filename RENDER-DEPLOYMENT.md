# 🚀 DEPLOYMENT EN RENDER - PASO A PASO

## ¿POR QUÉ RENDER?
- ✅ **Gratis** para empezar
- ✅ **Full-stack** en un solo lugar
- ✅ **Fácil configuración**
- ✅ **HTTPS automático**
- ✅ **Sin problemas CORS**

## 📋 PASOS PARA SUBIR TU PROYECTO:

### **PASO 1: Crear cuenta en Render**
1. Ve a: https://render.com/
2. Clic en "Get Started for Free"
3. Regístrate con tu email (bostonstock2025@gmail.com)

### **PASO 2: Subir tu código a GitHub**
1. Ve a: https://github.com/
2. Crea un repositorio nuevo llamado "sanando-con-cartas"
3. Sube todos los archivos de tu proyecto

**Archivos a subir:**
```
✅ index.html
✅ styles.css  
✅ script.js
✅ mercadopago-integration.js
✅ success.html
✅ failure.html
✅ backend-config.js
✅ package.json
✅ .env
✅ course-delivery-system.js
✅ images/ (carpeta completa)
```

### **PASO 3: Conectar Render con GitHub**
1. En Render, clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona "sanando-con-cartas"

### **PASO 4: Configurar el servicio**
```
Name: sanando-con-cartas
Environment: Node
Region: Oregon (US West)
Branch: main
Build Command: npm install
Start Command: npm start
```

### **PASO 5: Configurar variables de entorno**
En la sección "Environment Variables" agrega:

```
NODE_ENV=production
EMAIL_USER=bostonstock2025@gmail.com
EMAIL_PASS=ppgt nhfg nbgz oepx
MERCADOPAGO_PUBLIC_KEY=APP_USR-82a9259a-1964-4bbe-a4c4-8ab50745ba4d
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2823973966774541-070800-09828874bdf313cfa30a5c8f334e7f9b-305616995
DRIVE_LINK=https://drive.google.com/drive/folders/1QuJYZSicxy8Sd1V-jl42lGKSU43_UOAh?usp=sharing
SUPPORT_EMAIL=bostonstock2025@gmail.com
ADMIN_EMAIL=bostonstock2025@gmail.com
PORT=3000
```

### **PASO 6: Deploy**
1. Clic en "Create Web Service"
2. Espera 2-5 minutos mientras se despliega
3. ¡Tu sitio estará listo!

## 🎯 **POST-DEPLOYMENT:**

### **1. Obtener tu URL**
Render te dará una URL como: `https://sanando-con-cartas.onrender.com`

### **2. Configurar webhook en MercadoPago**
1. Ve a: https://developers.mercadopago.com.ar/
2. En tu aplicación, configura webhook:
   ```
   URL: https://tu-url.onrender.com/webhook/mercadopago
   Eventos: Payments
   ```

### **3. Probar tu sistema**
1. Ve a tu URL
2. Haz clic en "Obtener Curso Ahora"
3. ¡Realiza una compra de prueba!

## ✅ **VENTAJAS DE USAR RENDER:**

- 🌐 **URL pública** accesible desde cualquier lugar
- 🔒 **HTTPS automático** para seguridad
- ⚡ **Sin errores CORS** o localhost
- 📧 **Emails funcionando** perfectamente
- 💳 **MercadoPago integrado** sin problemas
- 🔄 **Auto-deploy** cuando actualices código

## 🎉 **RESULTADO FINAL:**

Una vez deployado tendrás:
- ✅ Tu página web funcionando 24/7
- ✅ Sistema de ventas completamente automático
- ✅ Clientes comprando y recibiendo el curso al instante
- ✅ Sin necesidad de intervención manual

---

¿Quieres que te ayude con algún paso específico del deployment?
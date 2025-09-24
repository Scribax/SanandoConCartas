# 🚀 Deployment Notes - Sanando Con Cartas

## ✅ SISTEMA COMPLETAMENTE CONFIGURADO

### 🌐 **URLs Oficiales:**
- **Sitio web:** https://sanandoconcartas.shop
- **Health check:** https://sanandoconcartas.shop/health
- **Estado del sistema:** https://sanandoconcartas.shop/status

### 🛡️ **Sistema de Alta Disponibilidad Implementado:**

#### **1. Auto-restart Agresivo (SystemD)**
- Reinicio automático en 5 segundos si falla
- Sin límite de reintentos
- Límites de memoria configurados (512M high, 1G max)
- Logging sistemático

#### **2. Health Check Automático**
- Verificación cada minuto via cron
- Auto-reinicio si no responde
- Logs en `/var/log/sanando-health-check.log`
- Máximo 3 reintentos antes de reinicio forzado

#### **3. Nginx con Failover**
- Página de mantenimiento automática si backend falla
- Timeouts optimizados (5s conexión, 10s lectura)
- Headers de seguridad configurados
- Cache para assets estáticos

#### **4. Backups Automáticos**
- Backup diario a las 3:00 AM
- Mantiene últimos 7 backups
- Excluye `node_modules` y `.git`
- Logs en `/var/log/sanando-backup.log`

#### **5. SSL/HTTPS Automático**
- Let's Encrypt configurado
- Auto-renovación de certificados
- Redirección HTTP → HTTPS
- Headers de seguridad

#### **6. Íconos y PWA**
- Favicons en todos los tamaños
- Web App Manifest
- Apple Touch Icons
- Android Chrome Icons
- Ícono personalizado "Pato" 🦆

### 🔧 **Comandos Útiles:**

```bash
# Estado del servicio
systemctl status sanando-con-cartas

# Ver logs en tiempo real
journalctl -u sanando-con-cartas -f

# Health check manual
curl https://sanandoconcartas.shop/health

# Ver logs de monitoring
tail -f /var/log/sanando-health-check.log

# Ver backups disponibles
ls -la /root/backups/

# Reiniciar manualmente si necesario
systemctl restart sanando-con-cartas
```

### 📊 **Servicios Configurados:**
- ✅ **Node.js Backend** - Puerto 3000
- ✅ **Nginx Proxy** - Puerto 80/443
- ✅ **SSL/TLS** - Let's Encrypt
- ✅ **Firewall** - UFW configurado
- ✅ **DNS** - sanandoconcartas.shop
- ✅ **Email** - Nodemailer configurado
- ✅ **Pagos** - MercadoPago integrado

### 🚨 **En caso de problemas:**
1. El sistema se auto-repara automáticamente
2. Si no, verificar logs: `journalctl -u sanando-con-cartas -f`
3. Restart manual: `systemctl restart sanando-con-cartas`
4. Verificar salud: `curl https://sanandoconcartas.shop/health`

### 💾 **Estructura de Backups:**
```
/root/backups/
├── sanando-backup-YYYYMMDD_HHMMSS.tar.gz
└── ... (últimos 7 backups)
```

---
**✨ Sistema configurado para 99.9% uptime con recuperación automática ✨**

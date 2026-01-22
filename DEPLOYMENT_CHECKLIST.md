# 🚀 Despliegue en Vercel - Checklist Rápido

## ✅ Pre-Despliegue

### 1. Verificar Archivos de Configuración
- [x] `vercel.json` existe y está configurado
- [x] `.gitignore` incluye `.env`, `.env.local`, `.vercel`
- [x] `.env.example` creado como template
- [x] `package.json` tiene script `build`

### 2. Preparar Variables de Entorno

Necesitas estos valores:

```
VITE_GEMINI_API_KEY=AIza...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

**¿Dónde obtenerlas?**
- Gemini: https://makersuite.google.com/app/apikey
- Supabase: https://app.supabase.com/project/_/settings/api

---

## 🚀 Opción Rápida: GitHub + Vercel (5 minutos)

### Paso 1: Subir a GitHub

```bash
git init
git add .
git commit -m "Preparar para Vercel"
git remote add origin https://github.com/tu-usuario/onyx-suite-2026.git
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Ve a https://vercel.com/new
2. Click "Import Git Repository"
3. Selecciona tu repo
4. Framework: **Vite**
5. Agrega variables de entorno
6. Click "Deploy"

**¡Listo en 2-3 minutos!**

---

## 🔧 Opción CLI: Vercel CLI

```bash
# Instalar
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# Agregar variables
vercel env add VITE_GEMINI_API_KEY production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Desplegar a producción
vercel --prod
```

---

## ✅ Post-Despliegue

### 1. Verificar que Funciona

Abre tu URL: `https://tu-proyecto.vercel.app`

- [ ] App carga sin errores
- [ ] Dashboard se muestra
- [ ] Puedes navegar

### 2. Probar API Serverless

Consola del navegador (F12):

```javascript
fetch('/api/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Hola' }] }]
  })
}).then(r => r.json()).then(console.log)
```

Debe devolver: `{ "text": "...", "success": true }`

### 3. Actualizar Orígenes Permitidos

Edita `api/middleware/validateOrigin.ts`:

```typescript
const allowedOrigins = [
    'http://localhost:3000',
    'https://tu-proyecto.vercel.app', // ← Agregar
];
```

Redespliega:
```bash
git add .
git commit -m "Actualizar orígenes"
git push
```

---

## 🐛 Problemas Comunes

### "API key not found"
```bash
vercel env add VITE_GEMINI_API_KEY production
```

### "CORS blocked"
Actualiza `validateOrigin.ts` con tu dominio

### Build fails
```bash
npm run type-check  # Verificar errores localmente
```

---

## 📚 Documentación Completa

Ver: [vercel_deployment_guide.md](file:///C:/Users/Josué/.gemini/antigravity/brain/54a93e76-498f-484e-8928-7dee2fb67401/vercel_deployment_guide.md)

---

## 🎯 Siguiente Paso Después del Despliegue

**Migrar geminiService.ts** para usar el proxy API:
- Reemplazar llamadas directas a GoogleGenAI
- Usar `geminiApiClient.ts`
- Probar todas las funciones AI

---

**¿Listo para desplegar?** 🚀

Opción más rápida: **GitHub + Vercel** (5 minutos)

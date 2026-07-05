# Sevilla, Ciudad de la Música — Portal de Reservas MVP

Este proyecto es una landing page de venta premium para el viaje cultural y musical **"Sevilla, Ciudad de la Música"**, programado del **31 de agosto al 5 de septiembre de 2026**. Ofrece un itinerario de 6 días con recitales y ópera (Gala Wagner), un formulario de reserva interactivo con tarifa dinámica y pasarela de pago integrada a través de **Stripe Checkout**.

---

## 🛠️ Stack Tecnológico
- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Base de Datos**: [Prisma](https://www.prisma.io/) ORM con **SQLite** para desarrollo local (listo para PostgreSQL en producción).
- **Estilos**: Tailwind CSS con paleta editorial (marfil, albero, burdeos, dorado y verde jardín).
- **Pagos**: [Stripe](https://stripe.com/) Checkout y Gestión de Webhooks.
- **Iconografía**: [Lucide React](https://lucide.dev/).

---

## 📋 Requisitos Previos e Instalación

### 1. Clonar e Instalar Dependencias
Instale los paquetes necesarios configurados en el proyecto:
```bash
npm install
```

### 2. Variables de Entorno (`.env`)
Cree un archivo `.env` en la raíz del proyecto y configure las siguientes variables de desarrollo:

```env
# URL de la base de datos (SQLite local)
DATABASE_URL="file:./dev.db"

# Claves de la API de Stripe
STRIPE_PUBLIC_KEY="pk_test_CLAVE_PUBLICA_AQUI"
STRIPE_SECRET_KEY="sk_test_CLAVE_SECRETA_AQUI"

# Secreto de firma del Webhook de Stripe (de la CLI o del Dashboard de Stripe)
STRIPE_WEBHOOK_SECRET="whsec_CLAVE_WEBHOOK_AQUI"
```

> [!NOTE]
> Las claves de Stripe deben solicitarse en el portal de desarrolladores de Stripe (mecanismo Test Mode).

### 3. Migraciones de la Base de Datos
El proyecto utiliza Prisma v7 configurado con conexión flexible. Para generar las tablas iniciales en SQLite ejecute:
```bash
npx prisma migrate dev --name init
```
Esto creará el archivo `prisma/dev.db` con la tabla `Reserva`.

---

## 🚀 Ejecución en Local
Para ejecutar el servidor de desarrollo en su máquina local:
```bash
npm run dev
```
La aplicación estará disponible de forma predeterminada en `http://localhost:3000`.

---

## 💳 Pruebas e Integración de Stripe

### Simulación de Pago Completa con Stripe CLI (Recomendado)
Para comprobar el funcionamiento del Webhook y actualización del estado de reservas automáticamente:

1. Instale la [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Autentíquese en Stripe:
   ```bash
   stripe login
   ```
3. Redirija los eventos de Stripe a su servidor local:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copie la clave `whsec_...` que proporciona la CLI y colóquela en el archivo `.env` bajo `STRIPE_WEBHOOK_SECRET`.
5. Ejecute un pago de prueba completando el Boletín de Reserva. Complete el formulario de Stripe con cualquier tarjeta de prueba y verá actualizar la reserva en base de datos al estado `pagada` y la consola imprimirá el envío simulado del correo electrónico de confirmación.

### Simulación Rápida sin Firma de Stripe (Modo de Desarrollo)
El endpoint `/api/stripe/webhook` incluye un mecanismo de bypass para desarrollo. Si el encabezado `stripe-signature` está ausente o la firma falla, se procesará el evento directamente (`checkout.session.completed`) sin lanzar excepciones de seguridad, facilitando el testeo con herramientas REST (Postman/cURL):
```bash
# Ejemplo de envío curl para simular pago exitoso:
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_colocar_session_id_aqui",
        "payment_status": "paid",
        "payment_intent": "pi_simulated_payment_intent"
      }
    }
  }'
```

---

## 🏛️ Lógica de Negocio y Restricciones
- **Precio Base**: **1.630 €** por persona (en habitación doble).
- **Suplemento Individual**: **260 €** adicionales por persona (**1.890 €** total).
- **Límite de Plazas (Aforo)**: Máximo **14 participantes**. El formulario bloquea las compras si se superan las plazas remanentes.
- **Grupo Mínimo**: **12 personas** (información preventiva mostrada en el boletín de reserva).
- **Fecha Límite**: **24 de julio de 2026**.

---

## 📂 Estructura de Directorios Clave
- `src/app/page.tsx`: Landing page principal compilada con las 14 secciones estipuladas.
- `src/app/api/checkout/route.ts`: Endpoint de creación de sesiones Stripe y cálculo del total en backend.
- `src/app/api/stripe/webhook/route.ts`: Webhook de persistencia de reservas y simulación de avisos.
- `src/app/api/reservas/route.ts`: Endpoint auxiliar que devuelve el aforo ocupado en tiempo real.
- `src/components/BookingForm.tsx`: Componente cliente interactivo del Boletín de Reserva con tarifa dinámica y control legal.
- `src/components/ItineraryTimeline.tsx`: Cronología interactiva día por día con hitos de conciertos, horarios y almuerzos.
- `src/components/VideoGallery.tsx`: Showcase que renderiza los `.mp4` de `/public/videos/*` o muestra tarjetas fallback "Vídeo próximamente" si faltan los archivos físicos.
- `public/docs/programa-sevilla-ciudad-musica.pdf`: Documentación PDF real disponible para los clientes.

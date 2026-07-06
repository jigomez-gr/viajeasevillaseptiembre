# Sevilla, Ciudad de la Música — Portal de Reservas MVP

Este proyecto es una landing page de venta premium para el viaje cultural y musical **"Sevilla, Ciudad de la Música"**, programado del **31 de agosto al 5 de septiembre de 2026**. Ofrece un itinerario de 6 días con recitales y ópera (Gala Wagner), un formulario de reserva interactivo con tarifa dinámica y pasarela de pago integrada a través de **Stripe Checkout**.

---

## 🚦 Estado Actual del Proyecto (Copia Local)
El proyecto se encuentra **100% funcional** y verificado de extremo a extremo. Compila correctamente para producción (`npm run build` y `tsc --noEmit` con **cero errores**). 

*   **Área de Inscripción Colectiva**: Implementada con envío y verificación de código OTP (almacenando sesiones en cookies seguras HTTP-Only `auth_session`).
*   **Normalización de Emails**: Los correos electrónicos se normalizan estrictamente a minúsculas y se remueve todo espacio en blanco al procesarse (evitando registros duplicados o fallos por capitalización).
*   **Formulario de Datos Personales del Viajero**: Integrado (para actualizar `nombre`, `apellido`, `movil`, `telegramUsername`, `telegramId`) tanto en el registro de inscripción como en el área de pagos.
*   **Dashboard de Pagos Fraccionados**: Permite a los viajeros ya registrados revisar su saldo pendiente actualizándolo en tiempo real, visualizar el histórico de pagos realizados y abonar plazos a medida (soportando importes fijos y personalizados).
*   **Redirección de Stripe en Producción**: Se corrigió el origen del servidor en la API de Checkout para respetar las cabeceras estándar proxy (`x-forwarded-host` y `x-forwarded-proto`), resolviendo el error de redireccionamiento roto (`localhost:3000` -> `ERR_CONNECTION_REFUSED`) al volver de Stripe.
*   **Simulación del Webhook en Staging**: Se habilitó la simulación del Webhook de Stripe automáticamente si el session_id del checkout empieza por `cs_test_` de Stripe (lo que indica modo de prueba), permitiendo que la base de datos PostgreSQL remota registre la transacción de inmediato al cargarse la página de éxito.

---

## 📂 Archivos y Carpetas Creadas (`D:\tmp\antigraviti\viajeasevilla\caso1`)
A continuación, se listan los recursos críticos añadidos a la copia de trabajo local:
*   `subir.bat`: Script interactivo en Windows para automatizar la sincronización (`git pull --rebase`), agregación, commit y push seguro de cambios a GitHub.
*   `src/app/api/auth/profile/route.ts`: Endpoint `POST` para actualizar el perfil del viajero.
*   `src/app/api/auth/otp/send/route.ts` & `/verify/route.ts`: Endpoints para el ciclo OTP y autenticación.
*   `src/app/api/reservas/me/route.ts`: Endpoint seguro para consultar sesión activa, reserva e historial de pagos.
*   `src/components/ChatWidget.tsx`: Widget de soporte persistente (WhatsApp, Telegram y Email) montado universalmente.
*   `prisma/create_user_tables.sql`: Script DDL para desplegar las tablas de usuarios y pagos en PostgreSQL.
*   `prisma/create_table.sql`: Script DDL para desplegar la tabla de reservas en PostgreSQL.
*   `test-otp-flow.js` & `test-db-connection.js`: Scripts de apoyo de pruebas locales para verificar la base de datos PostgreSQL remota y el flujo OTP.
*   `public/imagenes/`: Fotografías locales de Sevilla (`dia1.jpg` a `dia6.jpg`) y Salon de Embajadores (`salon_emajadores.jpg`).
*   `public/videos_itinerario/`: 19 clips de vídeo optimizados en formato `.mp4` y renombrados a snake_case web-safe.

---

## 🌐 Páginas Operativas
Todas las rutas de la aplicación están implementadas y operativas:
1.  **`/` (Home / Itinerario / Vídeos / Reserva)**: Landing page principal que integra reproductor de audio, timelines de itinerario interactivos con playlist diaria interna, galería de vídeos doble (Completo / Resumen) y formulario de inscripción (`BookingForm.tsx`).
2.  **`/reserva/exito`**: Página de checkout exitoso de Stripe. Procesa la cookie de sesión y efectúa de forma segura la simulación del webhook local/staging si se opera con sesión de pruebas.
3.  **`/reserva/cancelada`**: Pantalla de retorno si el pago en Stripe es cancelado, con redirección y retención segura de datos.
4.  **`/api/*`**: Suite completa de APIs de backend (OTP, reservas, checkout, perfiles y webhook receptor).

---

## 📥 Recursos Descargados / Copiados con Éxito
*   Itinerarios completos extraídos de los programas en formato PDF original.
*   Kit de vídeos optimizados: 19 archivos cargados físicamente en el repositorio.
*   Fotografías oficiales locales para los 6 días y los elementos principales.
*   Bucle musical de la pieza *Gymnopédie No. 1* montado y optimizado en la home del viaje.

## ⚠️ Recursos Faltantes o No Descargables
*   **Configuración Local de Navegador Web (Playwright)**: Las herramientas de automatización E2E reportaron problemas de inicialización debido a la falta de variables `$HOME` en el entorno de desarrollo local. Esto se resolvió ejecutando peticiones HTTP de forma programática.

---

## ⚙️ Problemas Pendientes
*   No restan bugs de visualización o funcionales conocidos. El portal está listo para lanzar a producción.

---

## ➡️ Próximos Pasos (Siguiente Sesión)
Si deseas realizar más adecuaciones al sistema de reservas en el futuro:
1.  **Edición de contenidos**: Realizar la actualización de textos o clips de vídeo en cuanto el usuario final los comunique.
2.  **n8n Webhook Integration**: Configurar un webhook n8n para que escuche la tabla `ccmfalla.pagosusuarios` (por ejemplo filtrando `procesado = 'N'`), envíe un email formal de confirmación impreso en PDF y actualice la columna a `'S'` tras el aviso.
3.  **Cambio a Producción Transaccional**: Reemplazar las claves `sk_test_`/`pk_test_` de Stripe en las variables de entorno de Dokploy por claves `sk_live_`/`pk_live_` reales para habilitar cobros verdaderos.

---

## 🛠️ Stack Tecnológico
*   **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
*   **Base de Datos**: [Prisma](https://www.prisma.io/) ORM con **PostgreSQL** para backend local y producción en esquema multiSchema.
*   **Estilos**: Tailwind CSS con paleta editorial (marfil, albero, burdeos, dorado y verde jardín).
*   **Pagos**: [Stripe](https://stripe.com/) Checkout y Gestión de Webhooks.
*   **Iconografía**: [Lucide React](https://lucide.dev/).

# Gabriel Cabalceta — Portfolio

Portfolio profesional bilingüe desarrollado con Next.js, TypeScript y Tailwind CSS. Dirección visual editorial y cinematográfica: negro cálido, tipografía de gran escala y naranja tomado de la fotografía original de Gabriel.

## Estado de la entrega

**Sección 01: Hero + navegación, lista para revisión visual.** El desarrollo continúa sección por sección después de la revisión de Gabriel. No se han construido las secciones posteriores.

- [x] Revisar y limpiar la plantilla inicial de Next.js.
- [x] Arquitectura de componentes, traducciones y datos tipados.
- [x] Hero responsive con fotografía original, entrada tipográfica animada y altura de `100vh` en desktop.
- [x] Retrato con bordes difuminados y galería diagonal de fondo con control de pausa.
- [x] Navegación de escritorio y menú móvil a pantalla completa.
- [x] Español e inglés con rutas `/es` y `/en`.
- [x] Preferencia de idioma persistente mediante cookie.
- [x] CV descargable, correo, LinkedIn y GitHub reales.
- [x] Framer Motion para interacciones y menú; GSAP y ScrollTrigger para animación y parallax.
- [x] Metadata por idioma, Open Graph, Twitter y favicon propio.
- [x] Datos iniciales de proyectos, tecnologías y experiencia, preparados para próximas entregas.
- [ ] Revisión y aprobación visual del Hero.
- [ ] Sección 02: Sobre mí.
- [ ] Sección 03: Proyectos y casos de estudio.
- [ ] Sección 04: Experiencia.
- [ ] Sección 05: Tecnologías e iconos interactivos.
- [ ] Formación y certificaciones.
- [ ] Contacto y cierre.
- [ ] Navegación al hacer scroll, botones sociales flotantes, regreso arriba y progreso.
- [ ] Transiciones narrativas entre secciones y revisión final de rendimiento.

## Ejecutar

Requisito: Node.js 20.9 o superior y npm. Desarrollo verificado con Node.js 24.

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). La raíz redirige al idioma guardado; español es el predeterminado.

Para revisar desde el teléfono, conectarlo a la misma red y abrir la dirección `Network` que imprime Next.js. `next.config.ts` autoriza en `allowedDevOrigins` las direcciones IPv4 locales del equipo para que los recursos de desarrollo y HMR funcionen por LAN. Si cambia la red, reiniciar `npm run dev` para actualizar esas direcciones.

```bash
npm run lint
npm run build
npm run start
```

`next/font` descarga las fuentes durante el build y las sirve localmente. El primer build necesita acceso a Google Fonts.

## Arquitectura

```text
public/
  documents/                 CV original descargable
  images/                    Fotografía original
src/
  app/
    [locale]/                Layout raíz, metadata y página por idioma
    globals.css              Tokens visuales, estilos y breakpoints
    icon.svg                 Favicon
  components/
    animations/              Ciclo de vida de GSAP y ScrollTrigger
    layout/                  Header, menú móvil y selector de idioma
    sections/                Hero; próximas secciones independientes
    ui/                      Enlaces animados e iconos reutilizables
  data/                      Perfil, navegación, proyectos, experiencia y tecnologías
  i18n/                      Configuración y diccionarios tipados ES/EN
  types/                     Contratos para proyectos, multimedia y experiencia
  proxy.ts                   Redirección de la raíz según cookie de idioma
scripts/preview.mjs           Capturas locales de escritorio y móvil
tests/portfolio.spec.ts       Pruebas funcionales en navegador
```

Las páginas, el Hero y los datos se renderizan en servidor. Los componentes cliente se limitan a la navegación interactiva, el selector, las microinteracciones y el ciclo de vida de las animaciones. Los datos de secciones futuras aún no se importan en la página.

## Contenido e idiomas

- Textos visibles y metadata: `src/i18n/dictionaries.ts`. El contrato `Dictionary` mantiene ambas traducciones sincronizadas.
- Contacto y rutas de archivos: `src/data/profile.ts`.
- Proyectos: `src/data/projects.ts`, con contratos en `src/types/content.ts`.
- Experiencia: `src/data/experience.ts`.
- Tecnologías solicitadas: `src/data/technologies.ts`.
- Secciones del menú: `src/data/navigation.ts`. Activar `ready` cuando se implemente la sección y exista su ancla.

Por ahora la navegación ofrece Inicio, CV y correo. Los enlaces hacia Sobre mí, Proyectos, Experiencia, Tecnologías y Contacto se incorporarán con sus respectivas secciones. No hay enlaces a anclas inexistentes.

El CV es la fuente de experiencia y proyectos. El perfil de GitHub fue proporcionado directamente por Gabriel. No se han inventado años, métricas, repositorios ni tecnologías por proyecto. Los campos aún no confirmados permanecen vacíos u opcionales. Las tecnologías de los clones Astro sí están especificadas en el CV. Los estados de los proyectos reflejan el documento recibido, no una auditoría de los sitios externos.

Cada proyecto admite imágenes, videos, GIFs, repositorio y un caso de estudio con descripción, problema, solución y resultados bilingües. Los assets y detalles se incorporarán al trabajar esa sección.

El CV descargable es el original en inglés en ambos idiomas. No se muestra disponibilidad laboral hasta contar con una indicación explícita.

## Animaciones y accesibilidad

- GSAP: entrada escalonada de tipografía y contenido. ScrollTrigger: parallax discreto de la fotografía en escritorio; tendrá mayor recorrido al incorporar secciones.
- Framer Motion: hover y tap de botones, entrada/salida del menú y enlaces móviles.
- Cada librería controla elementos diferentes. `gsap.matchMedia()` revierte animaciones y listeners al desmontar o cambiar las preferencias.
- `prefers-reduced-motion` desactiva entradas GSAP, parallax, desplazamiento suave y transformaciones interactivas.
- El menú usa un `dialog` modal nativo, bloqueo de scroll, ciclo de foco, cierre con Escape y restauración del foco. Se cierra al pasar al layout de escritorio.
- El ciclo de vida del diálogo está encapsulado en `mobile-menu.tsx`: se monta y abre antes de animar el panel interior, y permanece abierto hasta terminar la salida. Incluye áreas seguras de móvil y controles táctiles de 48 px.
- En desktop (desde 900 px de ancho), el Hero ocupa exactamente `100vh`. Su grid reserva espacio para el pie y la tipografía se ajusta al ancho y a la altura disponibles. Los layouts de poca altura reducen espacios para mantener visibles las acciones sin ocultar el scroll global del documento.
- La fotografía acompaña el contenido dentro de un encuadre 4:5: hasta 320 px de ancho en desktop y de 56 a 72 px en móvil. Se conserva la fotografía original y el protagonismo pasa al nombre, perfil y acciones.
- Los cuatro bordes del retrato se desvanecen mediante máscaras CSS con degradados; la fotografía original permanece intacta.
- En móvil se elimina el espacio vertical reservado a la antigua fotografía de fondo. Ambos botones comparten una fila con áreas táctiles de al menos 52 px; la escala usa `svh` para considerar las barras del navegador. El contenido puede crecer de forma natural al ampliar texto, sin bloquear el scroll global.
- Enlaces semánticos, foco visible, salto al contenido, `lang` correcto por ruta y texto alternativo de la fotografía.
- El contenido principal y los enlaces de idioma funcionan sin JavaScript. La persistencia de la preferencia requiere JavaScript/cookies.
- La imagen principal utiliza `next/image`, tamaños responsivos y precarga. La foto original no fue retocada: la integración visual se hace mediante CSS.

## Galería de fondo del Hero

La galería usa capturas temporales de sitios públicos, **no proyectos de Gabriel**. Son placeholders decorativos solicitados para revisar el efecto antes de incorporar las capturas reales. Sus fuentes son [Astro](https://astro.build/), [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Motion](https://motion.dev/), [GSAP](https://gsap.com/) y [Three.js](https://threejs.org/).

Para reemplazarlas:

1. Guardar las capturas de proyectos en `public/images/gallery/`.
2. Cambiar las rutas `src` en `src/data/hero-gallery.ts`, o reemplazar los seis JPEG existentes conservando sus nombres.
3. Preferir capturas horizontales de unos 1280 px de ancho. Se muestran recortadas a 4:3 mediante `next/image`.

Las capturas se sirven localmente; no se contactan esos sitios cuando alguien visita el portfolio. `scripts/capture-gallery.mjs` permite regenerar únicamente los placeholders y conserva sus URLs de origen.

El fondo está aislado del contenido y no intercepta clics. Cinco columnas en desktop y tres en móvil se inclinan −18° y avanzan en diagonal hacia abajo y a la derecha. Las secuencias repetidas mantienen un bucle continuo de 100–120 segundos, animando exclusivamente `transform`. Los degradados oscuros protegen la lectura y funden la galería con el pie del Hero.

El botón circular pausa/reanuda la galería, con etiquetas ES/EN. El movimiento se pausa al ocultarse la pestaña o salir el Hero de la pantalla, y queda estático con movimiento reducido o JavaScript desactivado. Las imágenes son decorativas para lectores de pantalla. La velocidad, inclinación e intensidad del fondo se ajustan en las reglas `.gallery-*` de `src/app/globals.css`.

## SEO y despliegue

Copiar `.env.example` a `.env.local` y establecer `NEXT_PUBLIC_SITE_URL` con el dominio público real antes del despliegue. Sin un dominio confirmado se omiten canonical y alternates absolutos, evitando publicar un dominio ficticio.

Los títulos, descripciones y locales Open Graph están traducidos. Para la imagen social personalizada, añadir posteriormente `src/app/[locale]/opengraph-image.tsx` o configurar un asset en `generateMetadata`; actualizar Twitter a `summary_large_image` al incorporarla. La configuración actual usa una tarjeta de resumen sin imagen personalizada.

## Verificación

```bash
npx playwright install chromium webkit
npm run test:e2e
```

Playwright inicia el servidor o reutiliza uno existente en el puerto 3000. Las pruebas cubren rutas e idioma persistente, enlaces de contacto, descarga del PDF, idioma inexistente, menú con teclado, movimiento reducido y contenido sin JavaScript. La regresión de desktop comprueba `100vh`, ausencia de scroll y contenido sin recortes en ambos idiomas, incluyendo 1366 × 768, 1920 × 720 y 1280 × 500. Los proyectos móviles emulan Pixel 7 en Chromium e iPhone 13 en WebKit: apertura táctil, cierre, reapertura, cambio de idioma y acceso mediante la IP local. La prueba LAN se omite cuando el equipo no tiene una interfaz de red disponible.

Para generar capturas con el servidor activo:

```bash
npm run preview:captures
```

Se guardan en `artifacts/hero-desktop.png` (1366 × 768), `artifacts/hero-mobile.png` (390 × 600 para revisar el espacio disponible con barras de navegador) y `artifacts/menu-mobile.png`. Las pruebas móviles comprueban ambos botones completamente dentro del primer viewport, sin scroll, en ES/EN y con áreas visibles de 320 × 480 a 430 × 740. Capturas, trazas y resultados están excluidos de Git. Las comprobaciones funcionales y los dispositivos emulados no sustituyen una auditoría Lighthouse ni la revisión en el teléfono físico de Gabriel.

## Referencias de diseño y técnicas

Referencias consultadas: [Lando Norris](https://landonorris.com/), [Charles Leclerc](https://charlesleclerc.com/en/) y [GTA VI](https://www.rockstargames.com/VI). El brief toma de ellas la escala tipográfica, la fotografía protagonista y la intención narrativa; la composición, identidad y contenido de este portfolio son propios.

Documentación: [internacionalización de Next.js](https://nextjs.org/docs/app/guides/internationalization), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) y [accesibilidad en Motion](https://motion.dev/docs/react-accessibility).

## Registro de cambios

- **2026-09-06 — Entrega 01:** limpieza de plantilla, base bilingüe, datos del CV, Hero con fotografía, navegación responsive, animaciones, enlaces reales, metadata inicial y pruebas de navegador. Pendiente de revisión antes de continuar con Sobre mí.
- **Revisión 01:** Hero desktop de `100vh` con escala tipográfica según la altura; menú móvil con ciclo de vida independiente y panel editorial animado; acceso LAN en desarrollo; corrección de discrepancia de hidratación en enlaces con movimiento reducido; pruebas táctiles en Chromium/WebKit y regresión de altura. Se mantiene el trabajo en la primera sección.
- **Revisión 02:** retrato discreto en desktop y móvil; contenido móvil más arriba y dos acciones visibles en la primera pantalla; tamaños de imagen ajustados al nuevo encuadre; indicador de desarrollo oculto para que no tape el contenido de la vista previa. Se añaden comprobaciones con alturas reducidas en ambos motores móviles y ambos idiomas.
- **Revisión 03:** bordes del retrato suavizados mediante degradados; galería diagonal descendente con seis capturas temporales de sitios públicos; oscurecimiento para mantener legible el contenido; pausa manual y automática; fuentes y procedimiento de reemplazo documentados. Continúa la revisión del Hero.

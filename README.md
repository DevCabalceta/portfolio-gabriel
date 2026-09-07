# Gabriel Cabalceta — Portfolio

Portfolio profesional bilingüe desarrollado con Next.js, TypeScript y Tailwind CSS. Dirección visual editorial y cinematográfica: negro cálido, tipografía de gran escala y naranja tomado de la fotografía original de Gabriel.

## Estado de la entrega

**Sección 01 aprobada. Sección 02: Sobre mí + transición de scroll, lista para revisión visual.** El desarrollo continúa sección por sección después de la revisión de Gabriel. Proyectos y las secciones posteriores permanecen pendientes.

- [x] Revisar y limpiar la plantilla inicial de Next.js.
- [x] Arquitectura de componentes, traducciones y datos tipados.
- [x] Hero responsive con robot 3D de Spline, entrada tipográfica animada y altura de `100vh` en desktop.
- [x] Retrato con bordes difuminados en Sobre mí y galería diagonal de fondo en el Hero con control de pausa.
- [x] Rol «Full Stack Developer» destacado con mayor tamaño, peso tipográfico y acento naranja.
- [x] Navbar fijo en todas las secciones y menú móvil a pantalla completa.
- [x] Español e inglés con rutas `/es` y `/en`.
- [x] Preferencia de idioma persistente mediante cookie.
- [x] CV descargable, correo, LinkedIn y GitHub reales.
- [x] Framer Motion para interacciones y menú; GSAP y ScrollTrigger para animación y transiciones.
- [x] Metadata por idioma, Open Graph, Twitter y favicon propio.
- [x] Datos iniciales de proyectos, tecnologías y experiencia, preparados para próximas entregas.
- [x] Revisión y aprobación visual del Hero.
- [x] Sección 02: Sobre mí, con contenido del CV y traducciones ES/EN.
- [x] Transición de Hero a Sobre mí: reducción de escala, desvanecimiento y desenfoque vinculados al scroll.
- [ ] Revisión y aprobación visual de Sobre mí.
- [ ] Sección 03: Proyectos y casos de estudio.
- [ ] Sección 04: Experiencia.
- [ ] Sección 05: Tecnologías e iconos interactivos.
- [ ] Formación y certificaciones.
- [ ] Contacto y cierre.
- [x] Botones flotantes monocromáticos de GitHub, LinkedIn, correo, WhatsApp y regreso arriba después del Hero.
- [ ] Indicador de progreso global de lectura.
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
    layout/                  Header fijo, menú móvil, idiomas y botones flotantes
    sections/                Hero, robot de Spline, galería y Sobre mí
    ui/                      Enlaces animados e iconos reutilizables
  data/                      Perfil, navegación, proyectos, experiencia y tecnologías
  i18n/                      Configuración y diccionarios tipados ES/EN
  types/                     Contratos para proyectos, multimedia y experiencia
  styles/                    Estilos del capítulo Sobre mí y transición narrativa
  proxy.ts                   Redirección de la raíz según cookie de idioma
scripts/preview.mjs           Capturas locales de escritorio y móvil
tests/portfolio.spec.ts       Pruebas funcionales en navegador
```

Las páginas, el Hero y los datos se renderizan en servidor. Los componentes cliente se limitan a la navegación interactiva, el selector, las microinteracciones, el robot 3D y el ciclo de vida de las animaciones. Los datos de secciones futuras aún no se importan en la página.

## Contenido e idiomas

- Textos visibles y metadata: `src/i18n/dictionaries.ts`. El contrato `Dictionary` mantiene ambas traducciones sincronizadas.
- Contacto y rutas de archivos: `src/data/profile.ts`.
- Proyectos: `src/data/projects.ts`, con contratos en `src/types/content.ts`.
- Experiencia: `src/data/experience.ts`.
- Tecnologías solicitadas: `src/data/technologies.ts`.
- Secciones del menú: `src/data/navigation.ts`. Activar `ready` cuando se implemente la sección y exista su ancla.

Por ahora la navegación ofrece Inicio, Sobre mí, CV y correo. Los enlaces hacia Proyectos, Experiencia, Tecnologías y Contacto se incorporarán con sus respectivas secciones. El ancla `#home` está en el contenedor estable de la transición para que el regreso al inicio funcione incluso cuando el Hero está fijado y reducido.

El CV es la fuente de experiencia y proyectos. El perfil de GitHub fue proporcionado directamente por Gabriel. No se han inventado años, métricas, repositorios ni tecnologías por proyecto. Los campos aún no confirmados permanecen vacíos u opcionales. Las tecnologías de los clones Astro sí están especificadas en el CV. Los estados de los proyectos reflejan el documento recibido, no una auditoría de los sitios externos.

Cada proyecto admite imágenes, videos, GIFs, repositorio y un caso de estudio con descripción, problema, solución y resultados bilingües. Los assets y detalles se incorporarán al trabajar esa sección.

El CV descargable es el original en inglés en ambos idiomas. No se muestra disponibilidad laboral hasta contar con una indicación explícita.

## Animaciones y accesibilidad

- GSAP: entrada escalonada del Hero y revelado letra por letra del título de Sobre mí. ScrollTrigger vincula la escala, opacidad y desenfoque de la sección anterior al scroll.
- Framer Motion: hover y tap de botones, entrada/salida del menú y enlaces móviles.
- Cada librería controla elementos diferentes. `gsap.matchMedia()` revierte animaciones y listeners al desmontar o cambiar las preferencias.
- `prefers-reduced-motion` desactiva entradas GSAP, transiciones de scroll, desplazamiento suave y transformaciones interactivas.
- El menú usa un `dialog` modal nativo, bloqueo de scroll, ciclo de foco, cierre con Escape y restauración del foco. Se cierra al pasar al layout de escritorio.
- El ciclo de vida del diálogo está encapsulado en `mobile-menu.tsx`: se monta y abre antes de animar el panel interior, y permanece abierto hasta terminar la salida. Incluye áreas seguras de móvil y controles táctiles de 48 px.
- En desktop (desde 900 px de ancho), el Hero ocupa exactamente `100vh`. Su grid reserva espacio para el pie y la tipografía se ajusta al ancho y a la altura disponibles. Los layouts de poca altura reducen espacios para mantener visibles las acciones sin ocultar el scroll global del documento.
- La fotografía está en Sobre mí, junto al perfil, en un encuadre 4:5 de 150 px de ancho en desktop y 120 px en móvil. El Hero presenta el robot de Spline y conserva el protagonismo del nombre, perfil y acciones.
- Los cuatro bordes del retrato se desvanecen mediante máscaras CSS con degradados; la fotografía original permanece intacta.
- En móvil se elimina el espacio vertical reservado a la antigua fotografía de fondo. Ambos botones comparten una fila con áreas táctiles de al menos 52 px; la escala usa `svh` para considerar las barras del navegador. El contenido puede crecer de forma natural al ampliar texto, sin bloquear el scroll global.
- Enlaces semánticos, foco visible, salto al contenido, `lang` correcto por ruta y texto alternativo de la fotografía.
- El contenido principal y los enlaces de idioma funcionan sin JavaScript. La persistencia de la preferencia requiere JavaScript/cookies.
- La fotografía utiliza `next/image`, tamaños responsivos y carga diferida. La foto original no fue retocada: la integración visual se hace mediante CSS.

## Sección 02: Sobre mí y transición

`src/components/sections/about.tsx` presenta el perfil de Gabriel con una composición editorial, títulos de gran escala, tonos oscuros y una iluminación naranja discreta. El contenido se toma del CV: desarrollo full stack en Cedes Don Bosco desde 2025, trayectoria en infraestructura y soporte entre 2022 y 2025, plataformas institucionales, APIs REST y bases de datos. No se añaden cifras de impacto ni credenciales no verificadas. Todos los textos traducibles están en `about` dentro de `src/i18n/dictionaries.ts`.

`ChapterTransition` (`src/components/animations/chapter-transition.tsx`) coordina la salida del capítulo anterior y la entrada del siguiente mediante GSAP ScrollTrigger:

- En desktop, el Hero conserva su altura de `100vh` y permanece en posición sticky mientras Sobre mí asciende por delante. La escala baja de 1 a 0.84, la opacidad de 1 a 0.08 y el desenfoque aumenta de 0 a 9 px según el avance real del scroll.
- En móvil se conserva el desplazamiento natural y la reducción es más sutil (hasta 0.96), con desenfoque de hasta 5 px. El contenido de Sobre mí fluye verticalmente y puede ocupar más de una pantalla.
- El inicio de la transición nunca es negativo: las diferencias entre `100svh` y la altura visible al cambiar las barras del navegador móvil no adelantan el efecto. En reposo, el Hero usa `filter: none`, `transform: none` y opacidad completa; al volver arriba recupera esa nitidez.
- El título entra letra por letra, con desplazamiento vertical y una ligera rotación, cuando alcanza el 82 % de la altura de pantalla. Su animación tiene duración propia para que un scroll rápido no la salte. Cada bloque de contenido se revela al llegar al 90 % de la pantalla. Al volver arriba, la secuencia se invierte y el Hero recupera tamaño, opacidad y nitidez. El título conserva un nombre accesible completo.
- El Hero cubierto pasa a `inert` para retirar sus controles de la navegación por teclado, y la galería deja de animarse. Al retroceder, se restauran las interacciones.
- Sin JavaScript o con `prefers-reduced-motion`, ambas secciones siguen en el flujo normal, visibles y sin fijación ni cambios de escala. `gsap.matchMedia()` limpia estilos y triggers al desmontar o cambiar de breakpoint/preferencia.

El menú de escritorio y el móvil ya incluyen Sobre mí. El regreso al inicio está en el grupo flotante. Los estilos específicos están separados en `src/styles/chapters.css`.

## Navbar y botones flotantes

El navbar permanece fijo por encima de las secciones y fuera del contenedor que se reduce y desenfoca. Su fondo oscuro tiene 30 % de opacidad en el Hero y 60 % al desplazar, con `backdrop-filter: blur(18px)` y compatibilidad WebKit. La altura es de 56–80 px en desktop (54 px en pantallas bajas) y 64 px en móvil (58 px en pantallas bajas). Los anclajes reservan espacio para la navegación.

`src/components/layout/floating-actions.tsx` muestra una columna de botones circulares monocromáticos al terminar el Hero, incluyendo cuando se llega mediante el menú. Usa exclusivamente los destinos confirmados: GitHub, LinkedIn, correo y WhatsApp. El enlace de WhatsApp es `https://wa.me/50683442305`, correspondiente al número de Costa Rica +506 8344 2305 proporcionado por Gabriel; abrirlo no envía mensajes automáticamente. El último botón regresa arriba y devuelve el foco al inicio. Antes de ese punto los controles están ocultos y son `inert`, por lo que no reciben foco. En móvil, Sobre mí reserva espacio lateral para que los botones no cubran el texto.

## Robot del Hero

`src/components/sections/hero-robot.tsx` carga mediante `React.lazy` y `Suspense` la [escena de Spline proporcionada por Gabriel](https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode), usando el [componente oficial React Spline](https://github.com/splinetool/react-spline). La escena se descarga desde Spline; requiere conexión y WebGL. El contenido y las acciones del Hero no esperan esa descarga.

- Desktop: escena a la derecha del contenido, con interacción del cursor y resplandor cálido discreto.
- Móvil y tablet por debajo de 900 px: el robot no se monta ni descarga su escena. Al cambiar de breakpoint se monta o desmonta automáticamente. El rol aprovecha el ancho disponible y ambos CTA permanecen dentro del primer viewport.
- Estado de carga, captura de errores y botón de reintento, traducidos a ES/EN.
- El robot no tiene botón de pausa visible. Se pausa automáticamente al quedar cubierto por Sobre mí, salir de pantalla u ocultarse la pestaña, y reanuda cuando vuelve al Hero.
- Con movimiento reducido se muestra un fotograma estático. La escena original comienza con el robot fuera de cámara: su entrada se reproduce oculta durante 2.5 segundos después del primer render y después se revela el robot ya pausado.
- Runtime fijado en `1.12.98`: el paquete `2.0.37` probado contiene referencias a archivos Draco/WASM ausentes que impiden compilar con Turbopack. No se modifican archivos dentro de `node_modules`.

Para cambiar el robot, reemplazar la constante `scene` en ese componente. La galería de proyectos sigue siendo el fondo del Hero. Las versiones y la escena externas deben volver a verificarse antes de actualizar el runtime.

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

Playwright inicia el servidor o reutiliza uno existente en el puerto 3000. Las pruebas cubren rutas e idioma persistente, enlaces de contacto, descarga del PDF, idioma inexistente, menú con teclado, movimiento reducido y contenido sin JavaScript. La regresión de desktop comprueba que el Hero mantiene `100vh` y su contenido sin recortes en ambos idiomas, incluyendo 1366 × 768, 1920 × 720 y 1280 × 500; el documento ahora tiene scroll para acceder a Sobre mí. También se verifica la reducción y el desvanecimiento del Hero, la entrada de Sobre mí y el regreso al inicio. Los proyectos móviles emulan Pixel 7 en Chromium e iPhone 13 en WebKit: apertura táctil, cierre, reapertura, cambio de idioma, navegación a Sobre mí y acceso mediante la IP local. La prueba LAN se omite cuando el equipo no tiene una interfaz de red disponible.

Las pruebas de navegación mantienen pendiente la descarga externa de Spline para comprobar la interfaz durante la carga sin depender de la red ni multiplicar renderizadores 3D. También verifican el desenfoque, el navbar fijo, los botones flotantes y la ubicación del retrato. La comprobación real e independiente de la escena, pausa, reanudación, movimiento reducido y recuperación ante errores se ejecuta con el servidor activo:

```bash
node scripts/check-robot.mjs
```

Este script usa Chromium con renderizado WebGL por software para la comprobación automatizada y guarda capturas `artifacts/robot-*.png`. No sustituye la revisión de fluidez con GPU en un teléfono físico.

Para generar capturas con el servidor activo:

```bash
npm run preview:captures
```

Se guardan en `artifacts/hero-desktop.png` (1366 × 768), `artifacts/hero-mobile.png` (390 × 600), `artifacts/menu-mobile.png`, `artifacts/chapter-transition.png`, `artifacts/about-desktop.png` y `artifacts/about-mobile.png`. Las pruebas móviles comprueban ambos botones completamente dentro del primer viewport, sin scroll, en ES/EN y con áreas visibles de 320 × 480 a 430 × 740. Capturas, trazas y resultados están excluidos de Git. Las comprobaciones funcionales y los dispositivos emulados no sustituyen una auditoría Lighthouse ni la revisión en el teléfono físico de Gabriel.

## Referencias de diseño y técnicas

Referencias consultadas: [Lando Norris](https://landonorris.com/), [Charles Leclerc](https://charlesleclerc.com/en/) y [GTA VI](https://www.rockstargames.com/VI). El brief toma de ellas la escala tipográfica, la fotografía protagonista y la intención narrativa; la composición, identidad y contenido de este portfolio son propios.

Documentación: [internacionalización de Next.js](https://nextjs.org/docs/app/guides/internationalization), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) y [accesibilidad en Motion](https://motion.dev/docs/react-accessibility).

## Registro de cambios

- **2026-09-06 — Entrega 01:** limpieza de plantilla, base bilingüe, datos del CV, Hero con fotografía, navegación responsive, animaciones, enlaces reales, metadata inicial y pruebas de navegador. Pendiente de revisión antes de continuar con Sobre mí.
- **Revisión 01:** Hero desktop de `100vh` con escala tipográfica según la altura; menú móvil con ciclo de vida independiente y panel editorial animado; acceso LAN en desarrollo; corrección de discrepancia de hidratación en enlaces con movimiento reducido; pruebas táctiles en Chromium/WebKit y regresión de altura. Se mantiene el trabajo en la primera sección.
- **Revisión 02:** retrato discreto en desktop y móvil; contenido móvil más arriba y dos acciones visibles en la primera pantalla; tamaños de imagen ajustados al nuevo encuadre; indicador de desarrollo oculto para que no tape el contenido de la vista previa. Se añaden comprobaciones con alturas reducidas en ambos motores móviles y ambos idiomas.
- **Revisión 03:** bordes del retrato suavizados mediante degradados; galería diagonal descendente con seis capturas temporales de sitios públicos; oscurecimiento para mantener legible el contenido; pausa manual y automática; fuentes y procedimiento de reemplazo documentados. Continúa la revisión del Hero.
- **Revisión 04:** «Full Stack Developer» pasa de una microetiqueta a una presentación destacada en naranja, con tipografía de 24–40 px en desktop (22 px en pantallas bajas) y 20–28 px en móvil/tablet. La composición conserva el nombre como título principal y las acciones visibles en el primer viewport móvil.
- **Entrega 02:** Sobre mí bilingüe, basado en el CV, con composición editorial y transición cinematográfica reversible desde el Hero. Se activa la navegación a Sobre mí, se mantiene el primer viewport móvil y se añaden comprobaciones de scroll, regreso al inicio, teclado y movimiento reducido. Pendiente de revisión antes de continuar con Proyectos.

- **Revisión de Entrega 02:** desenfoque en la salida del Hero; navbar fijo; controles flotantes monocromáticos después del Hero; fotografía trasladada a Sobre mí; título animado letra por letra al entrar en pantalla; robot interactivo de Spline con pausa, movimiento reducido y recuperación de errores. README y verificaciones actualizados. Continúa la revisión de estas dos secciones antes de pasar a Proyectos.
- **Ajustes de Hero y navegación:** robot exclusivo de desktop, sin control de pausa visible; WhatsApp añadido al grupo flotante con el número confirmado de Costa Rica; navbar más bajo, transparente y con desenfoque. Se conservan la pausa automática del robot, el movimiento reducido y la revisión sección por sección.
- **Nitidez móvil:** corregido el inicio anticipado de la transición cuando la altura visible supera `100svh`. Se eliminan filtros y transformaciones del Hero en reposo y se verifica el caso en Chromium y WebKit.

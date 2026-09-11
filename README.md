# Gabriel Cabalceta — Portfolio

Portfolio profesional bilingüe desarrollado con Next.js, TypeScript y Tailwind CSS. Dirección visual editorial y cinematográfica: negro cálido, tipografía de gran escala y naranja tomado de la fotografía original de Gabriel.

## Estado de la entrega

**Hero, Sobre mí y Proyectos aprobados. Sección 05: Servicios / Planes, lista para revisión visual.** El cierre de Cómo trabajamos ya tiene una entrada coreografiada. El desarrollo continúa sección por sección después de la revisión de Gabriel; Experiencia y las secciones posteriores permanecen pendientes.

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
- [x] Revisión y aprobación visual de Sobre mí.
- [x] Sección 03: Proyectos con once tarjetas en carrusel y galerías de capturas.
- [x] Transición de Sobre mí a Proyectos, título animado y revelado de imágenes.
- [x] Revisión y aprobación visual de Proyectos.
- [ ] Completar casos de estudio y tecnologías por proyecto con información confirmada.
- [x] Sección 04: Cómo trabajamos, con narrativa GSAP fijada, siete capítulos y contacto general por WhatsApp.
- [x] Cierre de Cómo trabajamos con reveal de palabras, detalle y CTA en secuencia.
- [x] Sección 05: Servicios / Planes con tres alcances editoriales y CTA de WhatsApp.
- [ ] Revisión y aprobación visual de Servicios / Planes.
- [ ] Sección 06: Experiencia.
- [ ] Sección 07: Tecnologías e iconos interactivos.
- [ ] Formación y certificaciones.
- [ ] Preguntas y respuestas con el diseño de lista desplegable.
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
    sections/                Hero, Sobre mí, Proyectos, Proceso y Servicios
    ui/                      Enlaces animados, iconos, multimedia y detalles de proyectos
  data/                      Perfil, navegación, proyectos, experiencia y tecnologías
  i18n/                      Configuración y diccionarios tipados ES/EN
  types/                     Contratos para proyectos, multimedia y experiencia
    styles/                    Estilos de Sobre mí, Proyectos y transiciones narrativas
  proxy.ts                   Redirección de la raíz según cookie de idioma
scripts/preview.mjs           Capturas locales de escritorio y móvil
tests/portfolio.spec.ts       Pruebas funcionales en navegador
```

Las páginas, el Hero y los datos se renderizan en servidor. Los componentes cliente se limitan a la navegación interactiva, las galerías, las microinteracciones, el robot 3D y el ciclo de vida de las animaciones. Los datos de secciones futuras aún no se importan en la página.

## Contenido e idiomas

- Textos visibles y metadata: `src/i18n/dictionaries.ts`. El contrato `Dictionary` mantiene ambas traducciones sincronizadas.
- Contacto y rutas de archivos: `src/data/profile.ts`.
- Proyectos: `src/data/projects.ts`, con contratos en `src/types/content.ts`.
- Experiencia: `src/data/experience.ts`.
- Tecnologías solicitadas: `src/data/technologies.ts`.
- Secciones del menú: `src/data/navigation.ts`. Activar `ready` cuando se implemente la sección y exista su ancla.

La navegación ofrece Inicio, Sobre mí, Proyectos, Proceso, Servicios, CV y correo. Los enlaces hacia Experiencia, Tecnologías y Contacto se incorporarán con sus respectivas secciones. Las anclas de las secciones permanecen en contenedores estables; se animan sus contenidos para evitar que la navegación apunte a posiciones transformadas.

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
- En móvil el Hero también permanece sticky para que Sobre mí ascienda por encima. Conserva su altura de 100svh y la reducción es más sutil (hasta 0.96), con desenfoque de hasta 5 px. El contenido de Sobre mí fluye verticalmente y puede ocupar más de una pantalla.
- El inicio de la transición nunca es negativo: las diferencias entre `100svh` y la altura visible al cambiar las barras del navegador móvil no adelantan el efecto. En reposo, el Hero usa `filter: none`, `transform: none` y opacidad completa; al volver arriba recupera esa nitidez.
- El título entra letra por letra, con desplazamiento vertical y una ligera rotación, cuando alcanza el 82 % de la altura de pantalla. Su animación tiene duración propia para que un scroll rápido no la salte. Cada bloque de contenido se revela al llegar al 90 % de la pantalla. Las entradas de texto se ejecutan una vez para conservar su visibilidad al regresar; la transición del Hero sigue siendo reversible y recupera tamaño, opacidad y nitidez. El título conserva un nombre accesible completo.
- El Hero cubierto pasa a `inert` para retirar sus controles de la navegación por teclado, y la galería deja de animarse. Al retroceder, se restauran las interacciones.
- Sin JavaScript o con `prefers-reduced-motion`, ambas secciones siguen en el flujo normal, visibles y sin fijación ni cambios de escala. `gsap.matchMedia()` limpia estilos y triggers al desmontar o cambiar de breakpoint/preferencia.

El menú de escritorio y el móvil ya incluyen Sobre mí. El regreso al inicio está en el grupo flotante. Los estilos específicos están separados en `src/styles/chapters.css`.

## Sección 03: Proyectos

Los once proyectos comparten un **carrusel horizontal** con el diseño de tarjetas aprobado. Se muestran tres tarjetas en escritorio (desde 1100 px), dos en tablet (700–1099 px) y una en móvil. Se conserva el orden actual de los datos: Upgrade! Comunicación y Entretenimiento, Fan de Maíz, Spotify Clone, GIF Search App y Academic ToDo; después siguen Matrícula, Intranet, CDC, EXPOTEC, BoscoNet y Tesla.

- Navegación: carrusel infinito en ambas direcciones, arrastre con el mouse en desktop y deslizamiento táctil. Las flechas naranjas permanecen activas al llegar al último proyecto y continúan desde el primero. Once indicadores reemplazan la barra inferior y permiten ir directamente a cualquier proyecto. Al enfocar el carrusel, las flechas del teclado recorren las tarjetas y Home/End seleccionan el primer/último proyecto.
- Avance automático: cada 3000 ms mientras el carrusel está visible, incluso con el mouse encima, al usar los controles o mientras la galería está abierta. No incluye botón de pausa ni pausas por interacción. Respeta movimiento reducido y suspende el temporizador al ocultar la pestaña o salir de pantalla. Todos los listeners y temporizadores se limpian al desmontar.
- Sin JavaScript: todas las tarjetas y sus enlaces siguen en una fila desplazable, con barra horizontal. Los controles que requieren JavaScript permanecen ocultos. Con movimiento reducido, el desplazamiento de los botones es inmediato.
- Información de las tarjetas: descripción, créditos y enlaces siguen un flujo natural. «Visitar proyecto» queda cerca de la información de su tarjeta, sin espacios añadidos para alinearlo con los proyectos de texto más largo.
- Atribución: los cinco proyectos profesionales muestran «Colaboración frontend · CEDES Don Bosco» y aclaran la contribución de Gabriel al frontend y la propiedad institucional, tanto en español como en inglés. Upgrade y Academic ToDo están identificados como «En desarrollo», sin enlace de producción.
- Galería continua: pulsar una portada abre una colección única de las 15 capturas de los once proyectos, empezando por la portada seleccionada. La imagen ampliada tiene bordes redondeados sobre un fondo oscuro transparente con desenfoque. El título, la atribución, la descripción y el contador aparecen centrados debajo; no hay miniaturas ni barra de scroll. Las flechas comparten el borde y acento naranja del carrusel exterior y las imágenes cambian con desplazamiento y desvanecimiento animados. Al terminar las imágenes de un proyecto continúa el siguiente y actualiza su título; la última vuelve a la primera. Incluye teclado, Escape y restauración del foco. Upgrade y ToDo conservan tres capturas originales cada uno. Sin JavaScript, la portada enlaza al archivo original.
- Datos: src/data/projects.ts conserva los once proyectos; featuredProjectIds determina cuáles aparecen primero. owner registra la propiedad institucional. Las tecnologías, repositorios y casos de estudio solo aparecen cuando hay información confirmada.
- Implementación: project-carousel.tsx utiliza [Embla Carousel React 8.6](https://www.embla-carousel.com/docs/v8/get-started/react), con loop y arrastre, sin duplicar las tarjetas ni sus IDs. project-gallery.tsx administra un único diálogo compartido por las portadas, con transiciones de Framer Motion. projects.tsx conserva el renderizado de las tarjetas y project-media.tsx las imágenes, GIF y videos.
- Entrada animada: el carrusel asciende y se desvanece desde abajo; el contenido de las tarjetas aparece escalonado con un desenfoque que se disipa. GSAP anima los bloques interiores para no interferir con las transformaciones de Embla. Las entradas se ejecutan una vez y se omiten con movimiento reducido.
- Transición: Proyectos asciende por encima de Sobre mí. El espacio del contenido fijado conserva su altura mediante una base flex automática, evitando que la sección se colapse durante el pin y desplace los anclajes. El pin se recalcula antes de los triggers dependientes; las animaciones del contenido de Sobre mí consideran su contenedor fijado y se ejecutan una vez, evitando ocultar nuevamente los textos al regresar. El contenedor exterior permite pintar el contenido fijado sin recortarlo. Fuera de la transición, Sobre mí recupera opacidad completa y elimina filtro y transformación. Se conserva la reducción, el desvanecimiento y el blur durante la superposición.

El índice desplegable se retiró de Proyectos. Su dirección visual queda **reservada para una futura sección de preguntas y respuestas**, pendiente de implementación y revisión, igual que Experiencia.

Spotify usa el [enlace Vercel confirmado](https://spotify-clone-silk-chi.vercel.app/) y el portal para familias aparece como [BoscoNet](https://bosconet.cedesdonbosco.ed.cr/v1/), conservando el nombre actual de los datos. Las capturas públicas de los nueve proyectos publicados se guardan localmente en public/images/projects/ y scripts/capture-projects.mjs conserva las URLs de origen. Solo se capturan páginas públicas, sin iniciar sesión ni enviar formularios. Las seis imágenes de Upgrade/ToDo fueron proporcionadas por Gabriel y se conservan intactas; no se deducen métricas ni stacks de sus paneles.

Para cambiar capturas, editar el arreglo media en los datos del proyecto. Para actualizar las capturas públicas:

```bash
node scripts/capture-projects.mjs
```

Con el servidor activo, node scripts/preview-projects.mjs genera vistas del carrusel y las galerías en escritorio y móvil dentro de artifacts/. tests/projects.spec.ts comprueba los once proyectos, navegación circular, puntos, teclado, arrastre con mouse, avance a los tres segundos sin detenerse por interacción, galería entre proyectos sin desbordamiento, atribuciones frontend y movimiento reducido. La regresión de Sobre mí incluye superposición sobre el Hero en móvil, regreso después de pasar el pin, cambio de altura de ventana, visibilidad real del título y recuperación del texto en Chromium y WebKit.

## Sección 04: Cómo trabajamos

Disponible en `#process`, después de Proyectos, y desde «Proceso» en la navegación de desktop y móvil. Presenta el recorrido de contratación en siete capítulos: primer contacto, descubrimiento, acuerdo, desarrollo, revisión y ajustes, lanzamiento con dominio y cierre/pago. Alcance, plazos, inversión y condiciones de pago se acuerdan antes de comenzar; el contenido no establece precios, anticipos, plazos fijos ni revisiones ilimitadas.

- Composición cinematográfica: una escena de pantalla completa permanece fijada durante el recorrido. El título ocupa el plano izquierdo y los capítulos se sustituyen en el derecho con grandes números delineados, órbitas, puntos de luz y una palabra de fondo que se desplaza con parallax. En móvil, ambos planos se apilan dentro de la misma escena sin convertirse en tarjetas.
- Coreografía GSAP: la entrada comienza con la microetiqueta, continúa por las tres líneas del título, el símbolo, la introducción, la acción y después revela etiqueta, título, descripción y detalle del primer capítulo. El scroll conduce las transiciones posteriores mediante máscaras, desplazamiento vertical, escala y blur; la línea inferior mide el avance y revierte naturalmente al subir.
- El selector de servicios y sus controles se eliminaron por completo. «Iniciar una conversación» conserva un contacto general a `https://wa.me/50683442305`; la comparación de alcances vive únicamente en la sección 05 y el enlace no envía mensajes automáticamente.
- Textos traducidos en `src/i18n/dictionaries.ts`, bajo `process`. El contenido se renderiza en `src/components/sections/process.tsx`, la secuencia en `src/components/animations/process-motion.tsx` y la dirección visual en `src/styles/process.css`.
- Sin JavaScript o con movimiento reducido, los siete capítulos vuelven al flujo normal y permanecen legibles; la lista conserva su semántica ordenada y el contacto sigue disponible.
- El cierre claro «Todo empieza con una conversación» ya no aparece directamente: la microetiqueta introduce la escena, el título se revela palabra por palabra mediante máscara y desplazamiento, y después entran el texto secundario y el CTA con blur progresivo. Esta secuencia usa la misma utilidad de reveals que Servicios.

Todas las fronteras entre capítulos utilizan `src/components/animations/cinematic-section-transition.ts`. Esta utilidad fija el plano anterior cuando corresponde y aplica los mismos valores base de dirección, profundidad, escala, opacidad, desenfoque, easing y scrub. Hero → Sobre mí, Sobre mí → Proyectos, Proyectos → Proceso y Proceso → Servicios comparten este sistema. `src/components/animations/cinematic-reveal.ts` unifica el easing y el ritmo de los reveals secuenciales sin imponer una composición idéntica a cada capítulo.

`tests/process.spec.ts` comprueba navegación, contacto ES/EN, ausencia del selector, secuencia y reversión, transición compartida sobre Proyectos, regreso al Hero, tamaños pequeños, movimiento reducido y contenido sin JavaScript en Chromium y WebKit. Con el servidor activo, `node scripts/preview-process.mjs` guarda las capturas de revisión en `artifacts/process-*.png`.

## Sección 05: Servicios / Planes

Disponible en `#services`, después de Cómo trabajamos y desde «Servicios» en la navegación. Presenta tres formas de trabajar con Gabriel: Landing Page por $150, Sitio Web por $300 y Proyecto Personalizado con alcance conversado. Los precios se muestran en USD. Cada acción abre WhatsApp con el servicio elegido dentro de un mensaje editable; nunca envía el mensaje automáticamente.

- Composición: tres módulos editoriales paralelos en desktop, separados por líneas verticales finas y grandes números de fondo. No se usan cards redondeadas, sombras, iconos repetidos, badges ni glow. El plan Sitio Web se destaca con una línea naranja, una frase editorial y un cambio mínimo de profundidad.
- Contenido: Landing Page enumera dominio, despliegue, responsive, redes/WhatsApp, rendimiento, SEO técnico, metadata, favicon, SSL, animaciones y CTA o formulario. Sitio Web incluye ese alcance y añade múltiples páginas, arquitectura, navegación, formulario, SEO por página, integraciones básicas y preparación para ampliaciones. El plan personalizado cubre plataformas, aplicaciones, sistemas e integraciones a medida.
- Movimiento: la microetiqueta precede al título enmascarado y al texto introductorio. En desktop, los planes se revelan 01 → 02 → 03 y cada uno encadena línea, número, nombre, precio, resumen, beneficios y CTA. En móvil, la misma microsecuencia se activa de manera independiente al alcanzar cada plan. Los números y la geometría ambiental responden suavemente al avance del scroll.
- Interacción: en desktop, el plan bajo el cursor gana presencia tipográfica, extiende una línea naranja y reduce con suavidad la presencia de los otros. Los CTA desplazan la flecha y mantienen foco visible; en móvil miden al menos 58 px de alto.
- Transición: Servicios asciende por encima del cierre claro de Proceso mientras ese plano reduce escala, pierde opacidad y se desenfoca. Se usa la transición común y el navbar permanece fuera de los planos animados.
- Accesibilidad y rendimiento: la lista de planes y las listas de beneficios conservan semántica nativa. Sin JavaScript o con movimiento reducido, todo queda visible en flujo normal; se eliminan transiciones decorativas y no se fijan secciones. Las animaciones principales usan transform y opacidad, y el blur se reserva para entradas breves.

La implementación está dividida entre `src/components/sections/services.tsx`, `src/components/animations/services-motion.tsx`, `src/styles/services.css` y el bloque `services` de `src/i18n/dictionaries.ts`. `tests/services.spec.ts` comprueba contenido ES/EN, precios, 28 beneficios, CTA de WhatsApp, transición compartida, reveal del cierre anterior, móvil, movimiento reducido y fallback sin JavaScript. Con el servidor activo, `node scripts/preview-services.mjs` genera las capturas `artifacts/services-*.png`. Experiencia, preguntas y respuestas y las siguientes secciones continúan pendientes de su propia entrega.

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
- **2026-09-08 — Entrega 03:** Proyectos bilingüe con tres destacados y capturas reales de sus páginas públicas, siete proyectos en un índice desplegable y soporte para multimedia y casos de estudio. Navegación a Proyectos, animaciones de entrada y transición reversible desde Sobre mí. Pendiente de revisión antes de continuar con Experiencia.

- **2026-09-09 — Revisión de Entrega 03:** cinco destacados en cuadrícula, seis proyectos en índice animado con capturas, galerías ampliables y las seis imágenes de Upgrade/ToDo. Sobre mí queda fijado mientras Proyectos asciende por encima. Atribución explícita de colaboración y propiedad de CEDES Don Bosco, nombre BosNet y enlaces de BosNet/Spotify corregidos. README y pruebas actualizados; continúa la revisión de Proyectos.

- **Carrusel y regreso a Sobre mí:** los once proyectos comparten las tarjetas del diseño aprobado en un carrusel responsive, con controles, contador, teclado y desplazamiento táctil. Se retira el índice y se reserva para preguntas y respuestas. Se corrige la coordinación de las entradas de texto con el pin de Sobre mí, se elimina el recorte del contenido fijado y se restaura la nitidez al regresar. README y pruebas de regresión actualizados.

- **Carrusel infinito y galería continua:** arrastre con mouse, avance cada tres segundos, pausas de interacción, once indicadores y flechas naranjas. Un único visor recorre las quince capturas con título y atribución del proyecto correspondiente. Entrada escalonada del carrusel y superposición de Sobre mí sobre el Hero también en móvil. Lint y build correctos; 47 pruebas de navegador aprobadas y dos casos de mouse omitidos en dispositivos táctiles. Se comprobó adicionalmente el gesto táctil en Chromium y la entrada animada. Continúa la revisión de Proyectos.

- **2026-09-10 — Ajustes de tarjetas y visor:** enlaces próximos a la descripción de cada proyecto; avance automático sin pausa por hover, foco o galería y sin botón de pausa. Visor transparente con desenfoque, imágenes redondeadas, títulos debajo y transición animada, sin miniaturas ni barras de desplazamiento. Las flechas comparten el diseño naranja del carrusel. Los créditos profesionales especifican la colaboración frontend y la propiedad de CEDES Don Bosco en ES/EN. Se revisaron las quince imágenes también en pantallas de 320 × 480 y 1280 × 500. Continúa la revisión de Proyectos.

- **Entrega 04 — Cómo trabajamos:** línea de tiempo bilingüe con siete etapas, introducción fija en desktop, recorrido vertical móvil y animaciones GSAP vinculadas al scroll. Selector de servicio con mensaje preparado para WhatsApp, navegación a Proceso y soporte sin JavaScript o con movimiento reducido. Proyectos queda aprobado; la nueva sección queda pendiente de revisión antes de continuar.

- **Revisión cinematográfica de Entrega 04:** Proceso se reconstruye como una escena narrativa fijada con siete capítulos, grandes numerales, órbitas, parallax, máscaras tipográficas y una coreografía secuencial conducida por el scroll. Se elimina por completo el selector de servicios y queda una acción general de WhatsApp. Las tres fronteras existentes adoptan una transición de profundidad reutilizable para que cada nueva sección herede el mismo comportamiento de entrada y salida. Continúa la revisión de Proceso antes de avanzar.

- **Entrega 05 — Servicios / Planes:** el cierre de Proceso gana una entrada secuencial de palabras, detalle y CTA mediante la utilidad común de reveals. La nueva sección compara Landing Page ($150), Sitio Web ($300) y Proyecto Personalizado en una composición editorial de líneas, numerales y espacio negativo, con coreografía 01 → 02 → 03, microinteracciones, adaptación vertical móvil y CTA de WhatsApp contextual. Proceso → Servicios reutiliza la transición cinematográfica global. Servicios queda pendiente de revisión antes de avanzar.

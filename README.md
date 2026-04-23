# Soberana — Bar de Mocktails · Madrid

Sitio web del bar de mocktails premium **Soberana**, ubicado en Madrid. Desarrollado como Trabajo de Fin de Grado (TFG) en UDIT. Construido íntegramente con HTML, CSS y JavaScript vanilla, sin frameworks ni dependencias externas.

🔗 **Repositorio:** [github.com/garciaanita/Web_Soberana](https://github.com/garciaanita/Web_Soberana)

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Maquetación | HTML5 semántico |
| Estilos | CSS3 — custom properties, Grid, Flexbox, `clamp()` |
| Interacción | JavaScript ES6+ vanilla |
| Tipografía | Fuentes locales ABC Fonts (Arizona Flare, Favorit Georgian, Diatype Greek Mono) |
| Animaciones | `requestAnimationFrame` con easing propio |
| Control de visibilidad | `IntersectionObserver` |

---

## Estructura del proyecto

```
soberana-v2/
├── index.html
├── css/
│   └── main.css
├── js/
│   └── main.js
└── assets/
    ├── icons/
    │   ├── soberana-imagotipo.svg
    │   └── soberana-isotipo.svg
    └── images/
        ├── cocktails/          # Fondos de cada panel
        │   ├── bubblespic.png
        │   ├── liquidopic.png
        │   ├── liquidpic3.png
        │   ├── mocktail pic.png
        │   ├── mocktail3.png
        │   └── vasocloseuppic2.png
        └── macro/              # Galería de ingredientes
            ├── fresapic.png
            ├── kiwipic.png
            ├── pomeloo.png
            ├── sandiaPic.png
            ├── naranja.png
            ├── limon.png
            └── MatchaPic.png
```

---

## Secciones

| # | ID | Contenido |
|---|----|-----------|
| 1 | `#inicio` | Hero — título principal y datos del local |
| 2 | `#nosotros` | Intro — historia y filosofía del bar |
| 3 | — | Galería — ingredientes de temporada |
| 4 | — | Quote — frase de marca |
| 5 | `#carta` | Carta — 14 mocktails con filtro por categoría |
| 6 | `#experiencia` | Valores — ingredientes, técnica y comunidad |
| 7 | `#reserva` | Reserva — información y formulario |
| 8 | — | Footer — navegación, redes y aviso legal |

---

## Funcionalidades destacadas

### Scroll horizontal con animación propia
La navegación entre secciones es horizontal en escritorio. La animación usa `requestAnimationFrame` con curva `easeOutExpo` (arranque rápido, frenada suave) en lugar del `behavior: 'smooth'` nativo del navegador, que es inconsistente entre browsers.

El listener de rueda está en `window` para capturar eventos en cualquier punto de la pantalla, incluyendo el nav fijo. La detección de dirección usa el **eje dominante** (mayor `|delta|` entre X e Y) para evitar que momentum residual produzca giros incorrectos. El lock de navegación se libera 400 ms después del último evento wheel, lo que absorbe la inercia del trackpad.

La sección **Carta** es la excepción: si el panel tiene contenido vertical scrolleable (`overflow-y: scroll`) y el gesto es vertical, se permite el scroll normal hasta llegar al límite, momento en que el siguiente gesto navega al panel lateral.

### Responsive
En pantallas ≤ 768 px el layout cambia a scroll **vertical** mediante media queries. Los paneles pasan de `100vw × 100vh` a `width: 100vw; height: auto; min-height: 100svh`.

### Cursor personalizado
Cursor de 6 px con `mix-blend-mode: difference` y color blanco puro. La fórmula `|#fff − color_fondo|` invierte automáticamente el color del fondo: el cursor aparece oscuro sobre secciones claras y claro sobre secciones oscuras, sin JavaScript adicional. En hover sobre elementos interactivos se expande a 36 px.

### Animaciones reveal
Los elementos con clase `.reveal` se animan al entrar en el viewport mediante `IntersectionObserver`. Las clases `.d1`, `.d2`, `.d3` añaden `transition-delay` escalonado.

### Filtro de carta
La sección de carta incluye filtro por categoría (Botánico, Fermentado, Adaptógeno, Clásico) mediante JavaScript puro.

### Formulario de reserva
Validación de campos obligatorios en el cliente con marcado visual de errores. La fecha mínima se establece dinámicamente a la fecha actual.

---

## Cómo visualizar el proyecto

El sitio es estático — no requiere servidor ni instalación de dependencias. Opciones:

**Live Server (VS Code)**
Instalar la extensión *Live Server* y hacer clic en `Go Live` con `index.html` abierto.

**Servidor local con Python**
```bash
cd soberana-v2
python3 -m http.server 8080
# Abrir http://localhost:8080
```

**Servidor local con Node.js**
```bash
npx serve .
```

> ⚠️ Abrir `index.html` directamente como archivo (`file://`) puede causar que el navegador bloquee la carga de fuentes locales por políticas de seguridad. Se recomienda usar un servidor local.

---

## Compatibilidad

| Navegador | Soporte |
|-----------|---------|
| Chrome / Edge 108+ | ✅ Completo |
| Safari 15.4+ | ✅ Completo |
| Firefox 110+ | ✅ Completo |
| Navegadores móviles modernos | ✅ Layout vertical |

Las unidades `svh` (small viewport height) tienen fallback a `vh` para navegadores anteriores.

---

## Paleta de color

| Variable | Valor | Uso |
|----------|-------|-----|
| `--negro` | `#231F20` | Color principal, texto |
| `--crema` | `#FFF9EE` | Fondo, texto sobre oscuro |
| `--topo` | `#79716C` | Textos secundarios |
| `--lima` | `#DFDF66` | Acentos, detalles hover |

---

*Desarrollado por Anita García · ESNE · 2025*

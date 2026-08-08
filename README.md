# ArcadeMania · Colección de Máquinas de Pinball

Frontend del proyecto integrador **ArcadeMania**, una interfaz de gestión para una colección de máquinas de pinball vintage y de colección. Permite visualizar el catálogo completo, consultar el detalle de cada pieza y registrar nuevas máquinas contra un backend REST real en producción.

**🔗 Versión de producción:** [https://arcademaniacs.netlify.app](https://arcademaniacs.netlify.app)

---

## Tecnologías

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-FF6C37?style=for-the-badge)
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-8A2BE2?style=for-the-badge)

| Capa          | Detalle                                      |
|---------------|----------------------------------------------|
| **Lenguaje**  | TypeScript Vanilla (strict, ES2023, sin `any`) |
| **Bundler**   | Vite 8                                       |
| **Estilos**   | Tailwind CSS 4 (tema personalizado)          |
| **Iconos**    | Lucide (nodos SVG reales, sin `innerHTML`)   |
| **Alertas**   | SweetAlert2 11 (wrapper temático)            |
| **Runtime**   | Bun                                          |

---

## Requisitos

- **Bun ≥ 1.1** instalado globalmente (`curl -fsSL https://bun.sh/install | bash`)

---

## Comandos

```bash
# Instalar dependencias
bun install

# Servidor de desarrollo con hot-reload
bun run dev

# Verificación de tipos TypeScript + build de producción
bun run build
```

---

## Estructura del proyecto

```text
arcademania/
├── index.html                    # Punto de entrada HTML
├── vite.config.ts                # Config de Vite + Tailwind
├── tsconfig.json                 # TypeScript estricto (noImplicitAny: true)
├── public/
│   ├── favicon.svg               # Ícono propio (pinball)
│   └── images/
│       └── pinball-placeholder.svg  # Fallback de imagen
└── src/
    ├── main.ts                   # Bootstrap (DOMContentLoaded)
    ├── config/
    │   └── app.config.ts         # URL base de la API y constantes
    ├── models/
    │   ├── pinball.model.ts      # interface PinballMachine + enum RarityTier
    │   └── index.ts              # Barrel export
    ├── services/
    │   └── pinball.service.ts    # Fetch tipado (unknown → PinballMachine), CRUD
    ├── utils/
    │   ├── format.utils.ts       # Formateadores (moneda, rating, unidades)
    │   ├── icon.utils.ts         # Wrapper de lucide (retorna SVGElement)
    │   └── alert.utils.ts        # Wrapper de SweetAlert2 con tema de la app
    ├── components/
    │   ├── PinballCard/          # Tarjeta de máquina (DOM puro, sin innerHTML)
    │   ├── FeaturedBanner/       # Banner de la pieza Leyenda
    │   ├── LoadingSkeleton/      # Skeletons animados para estados de carga
    │   ├── StateViews/           # Vistas de error y colección vacía
    │   └── PinballForm/          # Formulario de alta (validación reactiva)
    ├── views/
    │   └── pinballBoard.view.ts  # Orquestador: carga async, CRUD, estados UI
    └── styles/
        └── global.css            # Tailwind + tema custom (fuentes, paleta)
```

---

## API consumida

Base URL: `https://www.bahatech.cl/arcademania/api/v1/pinballs`

| Método   | Ruta           | Descripción                      |
|----------|----------------|----------------------------------|
| `GET`    | `/pinballs`    | Lista todas las máquinas (204 si vacío) |
| `POST`   | `/pinballs`    | Registra una nueva máquina       |
| `DELETE` | `/pinballs/:id`| Elimina una máquina por ID       |

---

## Pilares del Hito 2 aplicados

**Pilar 1 – Modelado de datos:** `interface PinballMachine` hermética con `enum RarityTier` estricto. Cero uso de `any` en todo el proyecto (validación con `unknown` + type guards en el servicio).

**Pilar 2 – Manejo del DOM:** Todos los componentes construyen el árbol con `createElement` y `appendChild`, sin `innerHTML`. El formulario aplica `event.preventDefault()` como primera instrucción, lee inputs con aserciones especializadas (`as HTMLInputElement`) y valida nulidad antes de acceder a `.value`.

**Pilar 3 – Arquitectura asíncrona:** Carga con `async/await` envuelta en `try/catch`. Feedback visual de carga (skeletons) antes de la petición. Validación de `response.ok` para interceptar errores HTTP 4xx/5xx. Mensajes de error descriptivos en pantalla con botón de reintento.

---

## 🎲 Datos de ejemplo/muestra para Poblar el Catálogo

Si necesitas agregar máquinas desde la interfaz, aquí tienes enlaces e información preparada para copiar y pegar directamente en el formulario.

### URLs de Imágenes Disponibles

*   `https://www.bahatech.cl/pinball/castlequest.svg`
*   `https://www.bahatech.cl/pinball/galaxy.svg`
*   `https://www.bahatech.cl/pinball/hauntedmadness.svg`
*   `https://www.bahatech.cl/pinball/neonrush.svg`
*   `https://www.bahatech.cl/pinball/radicalflippers.svg`

### Objetos de Carga Rápida

Los siguientes objetos están mapeados exactamente con los campos del formulario de la aplicación:

**1. Haunted Madness**
*   **MODELO *:** Haunted Madness
*   **FABRICANTE *:** Spooky Pinball
*   **AÑO DE FABRICACIÓN *:** 2018
*   **NIVEL DE RAREZA:** De Colección
*   **UNIDADES PRODUCIDAS:** 1200
*   **COSTO RESTAURACIÓN (USD):** 1120.50
*   **RATING DE CONDICIÓN (1.0 - 5.0):** 4.2
*   **URL DE IMAGEN:** `https://www.bahatech.cl/pinball/hauntedmadness.svg`
*   **Totalmente funcional:** ☑ (Marcar casilla)
*   **Tiene Multiball:** ☑ (Marcar casilla)

**2. Neon Rush 2077**
*   **MODELO *:** Neon Rush 2077
*   **FABRICANTE *:** Cyber Arcade Co.
*   **AÑO DE FABRICACIÓN *:** 2026
*   **NIVEL DE RAREZA:** Edición Limitada
*   **UNIDADES PRODUCIDAS:** 500
*   **COSTO RESTAURACIÓN (USD):** 2450
*   **RATING DE CONDICIÓN (1.0 - 5.0):** 5.0
*   **URL DE IMAGEN:** `https://www.bahatech.cl/pinball/neonrush.svg`
*   **Totalmente funcional:** ☑ (Marcar casilla)
*   **Tiene Multiball:** ☑ (Marcar casilla)

**3. Radical Flippers**
*   **MODELO *:** Radical Flippers
*   **FABRICANTE *:** Bally / Midway
*   **AÑO DE FABRICACIÓN *:** 1988
*   **NIVEL DE RAREZA:** Clásica
*   **UNIDADES PRODUCIDAS:** 6500
*   **COSTO RESTAURACIÓN (USD):** 980
*   **RATING DE CONDICIÓN (1.0 - 5.0):** 3.9
*   **URL DE IMAGEN:** `https://www.bahatech.cl/pinball/radicalflippers.svg`
*   **Totalmente funcional:** ☑ (Marcar casilla)
*   **Tiene Multiball:** ☐ (Dejar sin marcar)

**4. Space Cadet (Prueba sin opcionales)**
*   **MODELO *:** Space Cadet
*   **FABRICANTE *:** Maxis
*   **AÑO DE FABRICACIÓN *:** 1995
*   **NIVEL DE RAREZA:** Común *(o el valor por defecto)*
*   **UNIDADES PRODUCIDAS:** *(Dejar en blanco)*
*   **COSTO RESTAURACIÓN (USD):** *(Dejar en blanco)*
*   **RATING DE CONDICIÓN (1.0 - 5.0):** *(Dejar en blanco)*
*   **URL DE IMAGEN:** *(Dejar en blanco)*
*   **Totalmente funcional:** ☐ (Dejar sin marcar)
*   **Tiene Multiball:** ☐ (Dejar sin marcar)
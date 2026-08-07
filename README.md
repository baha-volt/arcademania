# ArcadeMania · Colección de Máquinas de Pinball

Frontend del proyecto integrador **ArcadeMania**, una interfaz de gestión para una colección de máquinas de pinball vintage y de colección. Permite visualizar el catálogo completo, consultar el detalle de cada pieza y registrar nuevas máquinas contra un backend REST real en producción.

---

## Tecnologías

| Capa          | Tecnología                                   |
|---------------|----------------------------------------------|
| Lenguaje      | TypeScript Vanilla (strict, ES2023, sin `any`) |
| Bundler       | Vite 8                                       |
| Estilos       | Tailwind CSS 4 (tema personalizado)          |
| Iconos        | Lucide (nodos SVG reales, sin `innerHTML`)   |
| Alertas       | SweetAlert2 11 (wrapper temático)            |
| Testing       | Vitest 3 + jsdom                             |
| Runtime       | Bun                                          |

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

# Ejecutar la suite de tests
bun run test

# Reporte de cobertura de código
bun run coverage
```

---

## Estructura del proyecto

```
arcademania-frontend/
├── index.html                    # Punto de entrada HTML
├── vite.config.ts                # Config de Vite + Vitest + Tailwind
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
tests/
    ├── config/                   # Tests del modelo y enum
    ├── utils/                    # Tests de formateadores
    ├── services/                 # Tests del servicio (fetch mockeado)
    └── components/               # Tests de componentes (jsdom)
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

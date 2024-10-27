# Social Crosspost

Una aplicación Next.js que permite publicar simultáneamente en Twitter y Threads usando clean architecture.

## Características

- Interfaz moderna y responsive usando Tailwind CSS y shadcn/ui
- Publicación simultánea en Twitter y Threads
- Arquitectura limpia con separación de responsabilidades
- Soporte para TypeScript
- Diseño minimalista y fácil de usar

## Requisitos Previos

- Node.js 18 o superior
- Credenciales de API de Twitter
- Credenciales de API de Threads

## Configuración

1. Clona el repositorio:
```bash
git clone <repository-url>
cd social-crosspost
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env.local
```

4. Configura tus credenciales de API:
   - Obtén tus credenciales de Twitter desde el [Portal de Desarrolladores de Twitter](https://developer.twitter.com)
   - Obtén tus credenciales de Threads (cuando esté disponible la API oficial)
   - Actualiza el archivo `.env.local` con tus credenciales

## Desarrollo

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
src/
├── domain/          # Interfaces y tipos
├── infrastructure/  # Implementaciones de servicios
├── application/     # Casos de uso
└── presentation/    # Componentes y UI
    ├── components/
    ├── hooks/
    ├── layouts/
    └── styles/
```

## Uso

1. Abre la aplicación en tu navegador
2. Escribe el contenido que deseas publicar
3. Selecciona las plataformas donde quieres publicar (Twitter y/o Threads)
4. Haz clic en "Post" para publicar en las plataformas seleccionadas

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

MIT

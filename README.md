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
- Cuenta de desarrollador de Twitter aprobada
- Credenciales de API de Twitter
- Credenciales de API de Threads
- ngrok (para pruebas locales con Twitter)

## Configuración de Twitter Developer

1. Crear cuenta de desarrollador:
   - Ve a [Twitter Developer Portal](https://developer.twitter.com)
   - Inicia sesión con tu cuenta de Twitter
   - Solicita una cuenta de desarrollador si aún no tienes una
   - Completa el proceso de verificación

2. Crear un proyecto:
   - Ve al [Dashboard de Twitter Developer](https://developer.twitter.com/en/portal/dashboard)
   - Clic en "Add Project"
   - Asigna un nombre a tu proyecto
   - Selecciona el caso de uso que mejor describa tu aplicación

3. Crear una aplicación:
   - Dentro de tu proyecto, clic en "Add App"
   - Asigna un nombre único a tu aplicación
   - En "User authentication settings", configura lo siguiente:
     - App permissions: Read and Write
     - Type of App: Web App
     - App info:
       - Callback URI / Redirect URL: `https://tu-url-ngrok.io/api/auth/twitter/callback` (en desarrollo)
       - Website URL: `https://tu-url-ngrok.io` (en desarrollo)
     - Optional info (recomendado completar):
       - Organization name
       - Organization website
       - Terms of service
       - Privacy policy

4. Obtener credenciales:
   - Una vez creada la aplicación, ve a la sección "Keys and Tokens"
   - Guarda los siguientes valores:
     - API Key
     - API Key Secret
     - Bearer Token
   - En la sección "Authentication Tokens", genera:
     - Access Token and Secret (si es necesario)

5. Configurar variables de entorno:
   ```env
   TWITTER_API_KEY=tu_api_key
   TWITTER_API_SECRET=tu_api_key_secret
   TWITTER_BEARER_TOKEN=tu_bearer_token
   NEXT_PUBLIC_APP_URL=https://tu-url-ngrok.io
   ```

**Notas importantes:**
- Mantén tus credenciales seguras y nunca las compartas
- No subas el archivo `.env.local` al control de versiones
- Si cambias la URL de callback en producción, actualiza la configuración en el portal de Twitter
- La cuenta de Twitter que uses para crear la aplicación debe tener un número de teléfono verificado
- Asegúrate de que tu cuenta de desarrollador tenga el nivel de acceso necesario para las funciones que planeas usar

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

## Configuración de ngrok para desarrollo local

Para que la autenticación de Twitter funcione en desarrollo local, necesitas configurar ngrok:

1. Instala ngrok:
   ```bash
   # Con npm
   npm install -g ngrok
   
   # O con Homebrew en macOS
   brew install ngrok
   ```

2. Inicia ngrok apuntando al puerto de desarrollo:
   ```bash
   ngrok http 3000
   ```

3. Copia la URL HTTPS que ngrok genera (ejemplo: `https://1234-tu-tunnel.ngrok.io`)

4. Actualiza tu aplicación en el [Portal de Desarrolladores de Twitter](https://developer.twitter.com):
   - Website URL: `https://tu-url-ngrok.io`
   - Callback URI: `https://tu-url-ngrok.io/api/auth/twitter/callback`

5. Actualiza tu archivo `.env.local` con la URL de ngrok:
   ```
   NEXT_PUBLIC_APP_URL=https://tu-url-ngrok.io
   ```

**Nota**: La URL de ngrok cambia cada vez que reinicias el servicio. Necesitarás actualizar tanto la configuración en Twitter como tu archivo `.env.local` con la nueva URL cada vez que esto suceda.

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
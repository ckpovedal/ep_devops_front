Frontend de Pacientes para la EP02. Esta aplicacion usa React, Vite y Nginx para servir la interfaz y enviar las solicitudes `/api` hacia el backend.

## Arquitectura

```text
Navegador
  -> Nginx frontend: puerto 80
    -> Backend Spring Boot: puerto 8080
```

## Desarrollo local

Instalar dependencias:

```bash
npm install
```

Ejecutar Vite:

```bash
npm run dev
```

## Docker

Construir imagen:

```bash
docker build -t frontend:v1.0.0 .
```

Ejecutar contenedor apuntando al backend:

```bash
docker run -p 80:80 -e BACKEND_URL=http://IP_PRIVADA_BACKEND:8080 frontend:v1.0.0
```

Levantar con Docker Compose:

```bash
docker compose up -d --build
```

## Variables de entorno

| Variable | Uso |
| -------- | --- |
| `BACKEND_URL` | URL interna del backend usada por Nginx |

En local puede ser:

```text
BACKEND_URL=http://pacientes-app:8080
```

En AWS puede ser:

```text
BACKEND_URL=http://IP_PRIVADA_BACKEND:8080
```

## Nginx

Nginx sirve los archivos estaticos desde `/usr/share/nginx/html` y redirige `/api` hacia el backend configurado con `BACKEND_URL`.

## GitHub Actions

El workflow `.github/workflows/cicd-frontend.yml` se ejecuta al hacer push a la rama `deploy`.

Secrets necesarios:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
AWS_REGION
ECR_REGISTRY
ECR_REPOSITORY_FRONTEND
EC2_FRONTEND_HOST
EC2_FRONTEND_USER
EC2_FRONTEND_SSH_KEY
BACKEND_URL
```

Valores usados en esta entrega:

```text
AWS_REGION=us-east-1
ECR_REGISTRY=058264156030.dkr.ecr.us-east-1.amazonaws.com
ECR_REPOSITORY_FRONTEND=eva2-frontend
```

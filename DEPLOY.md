VITALIS – Despliegue y ejecución

Producción con Docker
- Requisitos: Docker y Docker Compose.
- Construir e iniciar:
  docker compose -f docker-compose.prod.yml up -d --build
- Servicios:
  - db: Postgres 16 (persistencia en volumen `pgdata`)
  - api: Express + Prisma en :4001 (migraciones automáticas al arrancar)
  - web: Next.js en :3000
- Variables:
  - API usa `DATABASE_URL` y `PORT` (ver compose)
  - Web usa `NEXT_PUBLIC_API_URL` (args de build, actualizar si expones la API en otro host)

Apagar y limpiar:
  docker compose -f docker-compose.prod.yml down

Desarrollo local (sin Docker)
1) Base de datos: docker-compose up -d
2) Prisma:
   $env:DATABASE_URL = "postgresql://vitalis:vitalis@localhost:5432/vitalis?schema=public"
   npx prisma migrate deploy
   npx prisma generate
   npm run db:seed
3) Levantar todo: npm run dev:all (web:3000, api:4001)

Paginación y búsqueda de productos
- Endpoint: GET /products
- Parámetros: q (string), page (1+), pageSize (1..100)
- Respuesta: { items: Product[], total: number, page: number, pageSize: number }


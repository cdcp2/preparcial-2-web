# Travel Planner API

API REST construida con NestJS para planificar viajes. Centraliza la información de países obtenida desde [RestCountries](https://restcountries.com) y la almacena en SQLite como caché local, permitiendo crear planes asociados a países específicos.

## Requisitos previos

- Node.js 20+ y npm
- Nest CLI (opcional, facilita los comandos globales) `npm install -g @nestjs/cli`

## Puesta en marcha

1. Clonar el repositorio y entrar a `travel-planner-api/`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Copiar variables de entorno y ajustarlas si es necesario:
   ```bash
   cp .env.example .env
   # DATABASE_PATH indica la ruta del archivo SQLite (por defecto travel-planner.sqlite)
   # REST_COUNTRIES_BASE_URL normalmente no se modifica
   # COUNTRY_DELETE_TOKEN protege el endpoint DELETE /countries/:code
   ```
4. Ejecutar la API:
   ```bash
   # modo watch recomendado durante el desarrollo
   npm run start:dev

   # modo producción
   npm run start:prod
   ```
La API queda disponible en `http://localhost:3000` (puerto configurable mediante `PORT`).

## Descripción de módulos

- **CountriesModule**: Gestiona los países, aplica la lógica de caché en SQLite y expone endpoints de consulta.
- **TravelPlansModule**: Permite crear/listar/buscar planes de viaje asociados a un país existente.

## Provider externo

El módulo `RestCountriesModule` registra un provider (`COUNTRY_INFORMATION_PROVIDER`) que implementa la interfaz `CountryInformationProvider`. El servicio (`RestCountriesService`) consume el endpoint `GET /v3.1/alpha/{code}` pidiendo únicamente los campos requeridos (`cca3`, `name`, `region`, `subregion`, `capital`, `population`, `flags`). CountriesService inyecta esa abstracción y sólo conoce la interfaz, no los detalles HTTP.

## Modelo de datos

| Country                     | TravelPlan                                  |
|----------------------------|----------------------------------------------|
| `code` (PK, alpha-3)       | `id` (UUID, PK)                              |
| `name`                     | `countryCode` (FK → Country.code)            |
| `region`                   | `title`                                      |
| `subregion`                | `startDate` (date)                           |
| `capital`                  | `endDate` (date)                             |
| `population`               | `notes` (text, opcional)                     |
| `flagUrl`                  | `createdAt`                                  |
| `createdAt`, `updatedAt`   | relación ManyToOne para incluir el Country   |

## Endpoints principales

### Countries

| Método | Ruta                   | Descripción                                        |
|--------|------------------------|----------------------------------------------------|
| GET    | `/countries`           | Lista todos los países almacenados en SQLite.      |
| GET    | `/countries/:code`     | Busca por código alpha-3; usa caché + RestCountries|
| DELETE | `/countries/:code`     | Elimina un país sin planes asociados (token requerido)|

Ejemplos:
```bash
curl http://localhost:3000/countries
curl http://localhost:3000/countries/COL
curl -X DELETE http://localhost:3000/countries/COL \
  -H "x-country-delete-token: <COUNTRY_DELETE_TOKEN>"
```
La respuesta de `GET /countries/:code` incluye `source: "cache" | "external"` que indica el origen de la información.

### Travel Plans

| Método | Ruta                        | Descripción                                           |
|--------|-----------------------------|-------------------------------------------------------|
| POST   | `/travel-plans`             | Crea un plan verificando que el país exista en caché. |
| GET    | `/travel-plans`             | Lista todos los planes registrados.                   |
| GET    | `/travel-plans/:id`         | Obtiene un plan por su identificador UUID.            |

Ejemplo de creación:
```bash
curl -X POST http://localhost:3000/travel-plans \
  -H "Content-Type: application/json" \
  -d '{
    "countryCode": "COL",
    "title": "Vacaciones",
    "startDate": "2025-02-01",
    "endDate": "2025-02-15",
    "notes": "Visitar Medellín"
  }'
```

## Validación y DTOs

- `ValidationPipe` global (`src/main.ts`) habilita `whitelist` y conversión implícita.
- DTOs (`CreateTravelPlanDto`, `CountryResponseDto`, `TravelPlanResponseDto`) definen reglas de formato, longitud y fechas. Se usan `class-validator` y `class-transformer`.

## Pruebas

```bash
# Prueba unitaria mínima (AppModule compila)
npm test -- --runInBand

# End-to-end (usa un provider fake y SQLite en memoria)
npm run test:e2e -- --runInBand
```
Pruebas manuales sugeridas:
1. `GET /countries/COL` cuando no existe → debe traer de RestCountries y guardar.
2. Repetir la consulta anterior → debe responder con `source: "cache"`.
3. `POST /travel-plans` con un país existente → crea el plan y lo devuelve con el país embebido.

## Cómo funciona internamente

1. **Diseño de modelos**: `Country` y `TravelPlan` (TypeORM) cubren todos los campos solicitados y relacionan los planes con el campo `countryCode`.
2. **Módulo de países**: busca en SQLite, usa el provider externo en caso de fallo, persiste los campos necesarios e informa el origen de la respuesta.
3. **Provider externo**: abstrae RestCountries permitiendo reemplazar la implementación sin modificar `CountriesService`.
4. **Módulo de planes**: valida la entrada, garantiza que el país existe (creándolo vía CountriesModule si hace falta) y persiste el plan.

Con esto, el proyecto cumple los requerimientos del preparcial: API modular, caché local, provider dedicado, DTOs con validación, endpoints CRUD básicos y documentación mínima para evaluación.

## Extensión del parcial (70%)

La funcionalidad se amplió con nuevas capacidades de control y observabilidad. Se añadió `DELETE /countries/:code`, protegido por un guard que exige el header `x-country-delete-token` (valor configurado en `COUNTRY_DELETE_TOKEN`). Antes de eliminar, `CountriesService` confirma que el país exista y que no tenga planes de viaje asociados; si los hay, responde con error y evita inconsistencias. También se registró un middleware (`RequestLoggerMiddleware`) aplicado a `/countries` y `/travel-plans`, que imprime método, ruta, código de respuesta y duración de cada petición.

### Validación de las nuevas funciones

- **Endpoint protegido y guard**: define `COUNTRY_DELETE_TOKEN` en `.env`. Llama `DELETE /countries/COL` sin header y verás un `403 Forbidden`. Repite con `-H "x-country-delete-token: <TOKEN>"`; si hay planes asociados el servicio responde `400`, si no los hay devuelve `204` y borra el país de la caché. Los escenarios también están automatizados en `npm run test:e2e -- --runInBand`.
- **Middleware de logging**: al ejecutar `npm run start:dev`, cada request a `/countries` o `/travel-plans` genera una línea como `[RequestLoggerMiddleware] GET /countries 200 - 8ms`, mostrando método, ruta, status y tiempo total.

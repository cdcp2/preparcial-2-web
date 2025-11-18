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

Ejemplos:
```bash
curl http://localhost:3000/countries
curl http://localhost:3000/countries/COL
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

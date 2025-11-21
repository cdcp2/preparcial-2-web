# Travel Planner API

API REST construida con NestJS para planificar viajes. Centraliza la información de países obtenida desde RestCountries y la guarda en SQLite como caché local, permitiendo crear planes asociados a países específicos sin depender todo el tiempo de la API externa. El proyecto se organiza en dos módulos principales: Countries gestiona la caché de países y TravelPlans crea/lista planes usando los códigos alpha-3, además de un provider dedicado que encapsula RestCountries.

## Cómo lo corro en mi máquina

1. Entrar a `travel-planner-api/` y ejecutar:
   ```bash
   npm install
   ```
2. Copiar las variables de entorno y ajustarlas si hace falta:
   ```bash
   cp .env.example .env
   # DATABASE_PATH indica la ruta del archivo SQLite (por defecto travel-planner.sqlite)
   # REST_COUNTRIES_BASE_URL normalmente no se modifica
   # COUNTRY_DELETE_TOKEN protege el endpoint DELETE /countries/:code
   ```
3. Levantar el servidor:
   ```bash
   # modo watch recomendado
   npm run start:dev

   # producción
   npm run start:prod
   ```
La API queda disponible en `http://localhost:3000` (puedes cambiar el puerto con `PORT`). Para los tests uso `npm test -- --runInBand` (unitario) y `npm run test:e2e -- --runInBand` (end-to-end con SQLite en memoria).

## Qué hace cada módulo

CountriesModule define la entidad `Country` con código alpha-3, nombre, región, subregión, capital, población, URL de la bandera y las fechas de creación y actualización. Cuando recibo un `GET /countries/:code`, el servicio primero busca en SQLite. Si el país está guardado devuelve los datos inmediatamente e indica que el origen es la caché; si no existe consulta RestCountries a través de un provider especializado, limita la respuesta a los campos anteriores y persiste el registro. El provider vive en `RestCountriesModule` y solamente expone la función `findByAlpha3`, por lo que el servicio de países no necesita saber nada de URL o parámetros HTTP. TravelPlansModule define la entidad `TravelPlan` (uuid, código de país, título, fechas y notas opcionales), valida la entrada con DTOs y utiliza `CountriesService.ensureCountryExists` para traer o crear el país antes de guardar el plan.

## Endpoints y uso normal

Para consultar la caché llamo `GET /countries` y obtengo la lista completa ordenada por nombre. `GET /countries/COL` devuelve el país con un atributo `source` que me dice si la información venía desde RestCountries (`external`) o desde la base local (`cache`). Para registrar un viaje envío un POST a `/travel-plans` con un cuerpo JSON como:

```
{
  "countryCode": "COL",
  "title": "Vacaciones",
  "startDate": "2025-02-01",
  "endDate": "2025-02-10",
  "notes": "Visitar Medellín"
}
```

El servicio valida que el código tenga tres caracteres, que las fechas sean válidas y que la fecha de fin no sea anterior al inicio. Luego guarda el plan y me devuelve el objeto completo con el país embebido. Para listar todo uso `GET /travel-plans` y para ver un plan específico `GET /travel-plans/:id`.

## Borrado protegido y guard

En el parcial extendido agregué `DELETE /countries/:code`. Este endpoint sólo funciona si la petición incluye el header `x-country-delete-token` con el valor configurado en `COUNTRY_DELETE_TOKEN`. El guard revisa ese header y lanza `403 Forbidden` cuando falta o es incorrecto. Si el token es válido el servicio verifica dos cosas más: que el país exista y que no tenga planes asociados. Si hay planes devuelve `400` con un mensaje claro, y sólo en el caso de que no haya dependencias elimina el registro y responde con `204`. Esto permite limpiar la caché sin comprometer la integridad de los planes.

## Middleware de logging

Para tener visibilidad implementé `RequestLoggerMiddleware`, un middleware muy sencillo que envuelve las rutas de `/countries` y `/travel-plans`. Cada vez que llega una petición registra el método, la ruta, el código de respuesta y el tiempo que tardó en completarse. Mientras desarrollo sólo necesito mirar la consola donde corre `npm run start:dev` para ver líneas del tipo `[RequestLoggerMiddleware] POST /travel-plans 201 - 12ms`, lo cual me ayuda a detectar errores o lentitud rápidamente.

## Modelo de datos resumido

Ambas entidades viven en TypeORM. `Country` usa el código alpha-3 como clave primaria y almacena únicamente los campos necesarios del enunciado. `TravelPlan` tiene un `UUID` como identificador y guarda el `countryCode` como clave foránea hacia `countries.code`, además de fechas, título y notas. TypeORM se encarga de la relación ManyToOne, así que cuando cargo un plan ya viene con el país listo para exponerlo por la API.

## Provider externo

Para separar responsabilidades definí la interfaz `CountryInformationProvider` y un token de inyección. `RestCountriesService` implementa esa interfaz utilizando `HttpService` y solicita únicamente `cca3`, `name`, `region`, `subregion`, `capital`, `population` y `flags`. CountriesService sólo conoce el contrato y puede ser probado reemplazando la implementación por un fake, justo lo que hago en los tests end-to-end.

## Pruebas y casos manuales sugeridos

Los tests automáticos cubren lo básico: el módulo principal compila y los flujos críticos funcionan (consultar un país dos veces para validar la caché, crear planes, exigir el token de borrado, impedir eliminar países con planes y permitir la eliminación cuando no hay dependencias). Manualmente suelo repetir estos pasos para demostrar la API:

1. `curl http://localhost:3000/countries/COL` la primera vez para poblar la caché; la respuesta muestra `source: "external"`.
2. Repetir el mismo GET y comprobar que ahora el `source` cambia a `"cache"`.
3. Crear un plan con el POST anterior y luego listarlo para asegurarse de que se guardó.
4. Intentar borrar ese país sin token (403), con token pero con planes (400) y finalmente con token sobre un país sin planes (204). Cada intento deja una traza visible en los logs del middleware.

Con todo esto cubro los requisitos del preparcial y del parcial extendido: API modular, caché, provider dedicado, DTOs con validación, guard de autorización, middleware de logging y documentación que explica cómo usar y validar cada cambio. Si clonas el repo y sigues las instrucciones debería funcionar igual en tu entorno. ¡Éxitos!

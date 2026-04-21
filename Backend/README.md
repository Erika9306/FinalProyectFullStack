#  Movies Library (Backend)

Backend es el ""cerebro" de la aplicación que gestiona una lista de películas. La API REST se encarga de autenticar los usuarios, manejar la información en la base de datos y almacenar todo lo relevante y necesario para la aplicación.

## Funciones Principales

### 1. Gestión de Acceso de Usuarios y Control de Roles
- **Seguridad:** Implementación de **JSON Web Tokens (JWT)** para el manejo de sesiones seguras.
- **Encriptación:** Utilización de **Bcrypt** asegura la protección de información sensible.
- **Middlewares de Autorización:** Filtros personalizados que identifican si el usuario es `user` o `admin`, previniendo acciones no autorizadas y protegiendo la integridad de la aplicación.


### 2.  Modelado de Datos y CRUD
- **Mongoose:** Esquemas de datos optimizados para Usuarios, Películas y Listas de Favoritos.
- **Operaciones CRUD:** Gestión completa (Create, Read, Update, Delete) para el catálogo de películas y  de usuarios.
- **Borrado en Cascada:** Lógica programada para que, al eliminar un usuario, sus datos relacionados se limpien automáticamente de la base de datos.


### 3. Seeding, datos iniciales para arrancar la aplicación
- **Procesamiento de Datos:** Scripts personalizados que convierten datos desde formato **CSV a JSON** para facilitar su manejo.
- **Carga Masiva:** Sistema de *Seeding* para poblar la base de datos con registros iniciales.


## Tecnologías usadas en el Backend
- **Node.js:** Entorno de ejecución para JavaScript en el servidor. 
- **Express.js:** Framework para la creación de rutas y gestión de peticiones HTTP. 
- **MongoDB:**  Base de datos NoSQL para el modelado de objetos. 
- **JSON Web tokens, Bcrypt:** Estándares de la industria para la seguridad y autenticación. 


## Uso de la API
La API requiere autenticación mediante **JSON Web Tokens (JWT)** para realizar la mayoría de sus operaciones.
- **Autenticación y la Seguridad de la aplicación**: para las rutas protegidas se debe incluir el token que se obtiene mediante login dentro de las cabecezas de la petición HTTP:

| Permisos de Acceso | Descripción |
| :--- | :--- |
| ** Público** | No tiene restricciones para poder entrar por primera vez (Login/Register) |
| ** User// | Necesita un token que sea válido para el acceso a la plataforma. Permisos de lectura y gestíon de información personal |
| ** Admin// | Requiere un token válido y rol de administrador. El puede modificar el todo el contenido de las películas y usuarios |

## Endpoints

### Usuario

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/users/register` | Registro de un nuevo usuario | Público |
| **POST** | `/api/users/login` | Login que devuelve un JWT Token | Público |
| **GET** | `/api/users` | Lista de todos los usuarios | Admin |
| **GET** | `/api/users/:id` | Obtener información de un usuario | Usuario (Propio) / Admin |
| **PUT** | `/api/users/:id` | Actualizar perfil | Usuario (Propio) / Admin |
| **DELETE** | `/api/users/:id` | Borrar usuario en concreto | Usuario (Cuenta propia) / Admin |

### Películas


| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/movies` | Listar catálogo completo | Usuario / Admin |
| **GET** | `/api/movies/:id` | Ver detalle de una película | Usuario / Admin |
| **POST** | `/api/movies` | Subir nueva película | Admin |
| **PUT** | `/api/movies/:id` | Editar película y poster | Admin |
| **DELETE** | `/api/movies/:id` | Eliminar película del catálogo | Admin |


### Categorías y Listas

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/categories` | Visualizar categorías (géneros) | Usuario / Admin |
| **POST** | `/api/categories` | Crear nueva categoría | Admin |
| **POST** | `/api/lists/add/:movieId` | Añadir película a "Vistos" | Usuario |
| **GET** | `/api/lists/favourites/:userId` | Ver películas vistas de un usuario | Usuario (Propio) / Admin |

---

**Autor:** Erika Bausyte  
**Proyecto:** Movies Library
**Edición**: Rock{TheCode} Desarrollo Web V2
**Escuela de Negocios:** ThePower



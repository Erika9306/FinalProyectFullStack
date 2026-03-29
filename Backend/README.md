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

---

**Autor:** Erika Bausyte  
**Proyecto:** Movies Library
**Edición**: Rock{TheCode} Desarrollo Web V2
**Escuela de Negocios:** ThePower



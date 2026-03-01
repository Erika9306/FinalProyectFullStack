#  Movies Library - Frontend (React)

Esta es la interfaz de usuario de la aplicación **Movies Library**, una aplicación moderna construida con **React** que tiene el diseño responsive y se adapta a la mayoría de las pantallas. Ofrece una experiencia fluida y segura para la gestión de contenido cinematográfico, adaptando sus funciones según el perfil del usuario.

## Tecnologías

- **React:** el corazón del Frontend que da la vida a la interfaz moderna, fácil de usar, muy útil ya que evita recargas innecesarias del navegador ni del contenido. 
- **Vite:** un servidor de desarrollo súper rápido, que inicia el proyecto casi de inmediato
- **Jwt-Decode:** una herramienta imprescindible para la autenticación del usuario 
- **SweetAlert2:** alertas visualmente atractivas para mensajes de confirmación o de algún tipo de error.


##  Funcionalidades Implementadas

###  Autenticación y Autorización
- **Sistema de Login/Registro:** Validación de credenciales mediante un token y almacenamiento persistente mediante `localStorage`.
- **Protección de Rutas:** Navegación condicional basada en el rol del usuario (`user` / `admin`).

###  Panel de Usuario 
- **Catálogo Dinámico:** Exploración de películas con carga asíncrona e información detallada.
- **Lista de Favoritos:** Sección personal para gestionar películas preferidas pulsando el icono del ❤️.
- **Perfil Personal:** Edición de datos (nombre, contraseña, foto de perfíl) y opción de eliminar la cuenta propia.

###  Panel de Administración
- **Control de Catálogo (CRUD):** Creación, edición y eliminación completa de películas, o usuarios.
- **Control de Usuarios:** Capacidad para supervisar la comunidad, editar datos de usuarios o eliminarlos de la plataforma.

---

## Instalación y Uso
   Para desplegar este frontend localmente:
1. Instala las dependencias con `npm install`.
2. Inicia vite: `npm run dev`.

---

**Autor:** Erika Bausyte  
**Proyecto:** Movies Library
**Edición**: Rock{TheCode} Desarrollo Web V2
**Escuela de Negocios:** ThePower

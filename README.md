#  Movies Library - Proyecto FullStack

 Este proyecto ha sido desarrollado siguiendo una arquitectura **MERN** (MongoDB, Express, React, Node.js). Ofrece una interfaz amigable y atractiva tanto para administradores como para usuarios finales. La aplicación se basa en una **arquitectura desacoplada**, separando el Backend del Frontend para que funcionen de forma independiente pero perfectamente sincronizada.


## 🔗 Despliegue 
| Entorno | Enlace |
| :--- | :--- |
| ** Frontend (Vercel)** | [Visitar Aplicación](https://final-proyect-full-stack.vercel.app) |
| ** Backend (API Render)** | [Ver API](https://finalproyectfullstack.onrender.com) |

> [!IMPORTANT]
> **Nota sobre el rendimiento:** Debido al plan gratuito de **Render**, el servidor entra en "modo reposo" tras 15 minutos de inactividad. La primera carga de datos puede tardar **aproximadamente 1 minuto**.

---


##  Estructura del Proyecto

El ecosistema se divide en dos grandes bloques que trabajan de forma paralela:
1. **Backend**: API REST que gestiona la lógica de negocio, autenticación JWT y seguridad con Bcrypt.
2. **Frontend**: La experiencia visual. Una interfaz reactiva construida con **React (Vite)**, optimizada con hooks avanzados y validaciones dinámicas.

---

##  Funcionalidades

- **Sistema de Roles:** Middleware personalizado para restringir el acceso a rutas sensibles según el rol (admin/user).
- **Seguridad Robusta:** Rutas protegidas en el cliente y el servidor, con persistencia de sesión mediante LocalStorage y Tokens JWT.
- **Automatización de Datos:** Script personalizado para poblar la base de datos desde archivos CSV, asegurando un entorno de pruebas real desde el inicio.
- **Buscador rápido**: Optimización mediante el hook useMemo para filtrar el catálogo en memoria del cliente, logrando resultados instantáneos sin peticiones extra al servidor y evitando recargas del navegador.
- **Interfaz de Notificaciones**: Integración de SweetAlert2 para confirmar acciones críticas (como borrar una cuenta o añadir a favoritos) de forma elegante.
- **Formularios de Alto Rendimiento**: Gestión de formularios usando React Hook Form, que reduce los re-renderizados innecesarios y validando los datos en tiempo real.
- **Diseño Adaptativo (Responsive)**: Media Queries, garantiza que la aplicación sea perfectamente navegable en móviles, tablets y escritorio.


---

**Autor:** Erika Bausyte  
**Proyecto:** Movies Library
**Edición**: Rock{TheCode} Desarrollo Web V2
**Escuela de Negocios:** ThePower

# Biblioteca Digital - Backend

Este es el backend de una plataforma de biblioteca digital desarrollado con JavaScript, Express.js y MongoDB. Permite a los usuarios registrarse, iniciar sesión, y reservar libros de forma digital. Además, se gestionan permisos de acceso y se maneja el historial de reservas.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens) para autenticación
- Bcrypt.js para encriptar contraseñas
- Postman para pruebas de endpoints
- dotenv para manejar variables de entorno

## Estructura del Proyecto

│
├── src/
  ├── controllers/ # Lógica de cada recurso
  ├── models/ # Esquemas de Mongoose (Usuario, Libro)
  ├── routes/ # Endpoints de la API
  ├── middleware/ # Autenticación JWT
├── app.js # Punto de entrada principal
├── .env # Variables de entorno (no incluido en el repositorio)
├── .gitignore 
├── README.md 

## Cómo ejecutar el proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/anyelot/backend-proyecto01.git
cd backend-proyecto01
```

### 2. Instala las dependencias
```bash
npm install
```
### 3. Configura las variables de entorno
Crea un archivo .env en la raíz del proyecto.

### 4. Inicia el servidor
```bash
npx nodemon app.js
```

## Endpoints Principales
### Usuarios
POST /api/users/register – Registro de usuario

POST /api/users/login – Login y token JWT

PUT /api/users/:id – Actualizar usuario (autenticado)

DELETE /api/users/:id – Inhabilitar usuario (soft delete)

### Libros
POST /api/books – Crear libro (requiere permiso)

GET /api/books – Buscar libros (filtros dinámicos)

GET /api/books/:id – Obtener libro por ID

PUT /api/books/:id – Modificar libro (requiere permiso)

DELETE /api/books/:id – Inhabilitar libro (soft delete)
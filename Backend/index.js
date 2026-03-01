require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const userRouter = require('./src/api/routes/user.js');
const movieRouter = require('./src/api/routes/movie.js');
const categoryRouter = require('./src/api/routes/category.js');
const listRouter = require('./src/api/routes/listUserMovie.js');

const connectDB = require('./src/config/db.js');
const connectCloudinary = require('./src/config/cloudinary.js');

const PORT = process.env.PORT || 3000;

/**
 * Configuración global del backend, por donde se entra ne la aplicación
 * definición de rutas, conexio´n a Db, middlewares
 */

// Global middlewares

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Funciñon de arranque de apllicación antes de que empiece a enviar peticiones a DB
async function startServer() {
    try {        
        await connectDB();
        console.log('MongoDB connected');  
        await connectCloudinary();

        //Routes
        app.use('/api/v1/user', userRouter);
        app.use('/api/v1/movies', movieRouter);
        app.use('/api/v1/categories', categoryRouter);
        app.use('/api/v1/list', listRouter);

        /** Error Middleware
         * este middleware captará errores de peticiones o rutas
         */
        app.use((req, res, next) => {
            const err = new Error('Route not found, passed through error middleware');
            err.status = 404;
            next(err);
        });
        app.use((err, req, res, next) => {
            return res.status(err.status || 500).json({ message: err.message || "Unexpected error" });
        });

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error(' Failed to start server:', err.message);
       
    }
}

startServer();

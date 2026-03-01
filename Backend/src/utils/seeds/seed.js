const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../../api/models/User');
const Category = require('../../api/models/Category');
const Movie = require('../../api/models/Movie');
const connectDB = require('../../config/db');

/**
 * el archivo de siembra de datos que primero lee los archivos csv y leugo los transforma al json
 * luego desde le formatoto json los datos de insertan en MongoDb  
 */


// CSV y JSON paths
const usersCSV = path.join(__dirname, 'Users.csv');
const categoriesCSV = path.join(__dirname, 'Categories.csv');
const moviesCSV = path.join(__dirname, 'Movies.csv');

const usersJSON = path.join(__dirname, 'Users.json');
const categoriesJSON = path.join(__dirname, 'Categories.json');
const moviesJSON = path.join(__dirname, 'Movies.json');

// Leer CSV y devolver array de objetos
function readCSV(file) {
    const content = fs.readFileSync(file, 'utf8');

    //expresíon regular para manejar saltos de línea, espacios, líneas vacías
    
    const rows = content.split(/\r?\n/).filter(r => r.trim() !== '');
      const headers = rows[0].split(';').map(h => h.trim().replace(/^\uFEFF/, ''));
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(';');
        const obj = {};

        headers.forEach((header, index) => {
        //extraemos valor del fila del documento csv
        const value = row[index] ? row[index].trim() : "";
            obj[header] = value;

        // Convertir fechas en formato DD/MM/YYYY a objetos Date        
        if(header ==='available' && value.includes('/')){
            const dateMovie = value.split('/');
            if(dateMovie.length ===3){
                const day = dateMovie[0];
                const month = dateMovie[1];
                const year = dateMovie[2];
                obj[header] = new Date(year, month - 1, day);
            }
        }
        });
        data.push(obj);
    }
    return data;
}

// Generar JSON si no existe
function generateJSON(csvPath, jsonPath) {
    if (!fs.existsSync(jsonPath)) {
        const data = readCSV(csvPath);
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`JSON : ${path.basename(jsonPath)}`);
    } else {
        console.log(`ℹJSON already exists: ${path.basename(jsonPath)}`);
    }
}

// SEEDING 
async function insertSeeds() {
    await connectDB();
    try {
       
        // Generar JSON de CSVs
        generateJSON(usersCSV, usersJSON);
        generateJSON(categoriesCSV, categoriesJSON);
        generateJSON(moviesCSV, moviesJSON);

        const usersData = JSON.parse(fs.readFileSync(usersJSON, 'utf8'));
        const categoriesData = JSON.parse(fs.readFileSync(categoriesJSON, 'utf8'));
        const moviesData = JSON.parse(fs.readFileSync(moviesJSON, 'utf8'));
       
        //INSERT CATEGORIEs  
        await Category.insertMany(categoriesData);
        console.log('✅ Categories inserted');       
        const categoryIdMongo = await Category.find();
        const categoryId = {};
        categoryIdMongo.forEach(category => {
            categoryId[String(category.id)] = category._id;
        });
        console.log('all categories has been inserted');
        
        // MOVIEs
        
        const movieCategoryId = moviesData.map(movie => {
            const movieCatId = String(movie.category || '');
            return {
                ...movie,
                imgUrl: movie.imgUrl,
                category: categoryId[movieCatId] || null
            }
        });
        await Movie.insertMany(movieCategoryId);
        console.log(' Movies inserted all');

        // Insertar Users
        await User.deleteMany({});
        for (let i = 0; i < usersData.length; i++) {
            const user = usersData[i];
            try {
                if (user.email && user.password) {
                    const newUser = new User({
                        email: user.email.trim().toLowerCase(),
                        name: user.name,
                        password: String(user.password), 
                        img: user.img || 'https://us.123rf.com/450wm/get4net/get4net1902/get4net190209043/125446708-anonymous-faceless-user.jpg',
                        role: user.role || 'user',
                        movies: []
                    });
                    await newUser.save();
                    
                }
            } catch (error) {
                console.log(`incomplete data:`, error.message);
            }
            
        } 
        
       await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB after seeding');

    } catch (err) {
        console.error('❌ Error inserting seeds:', err);
        mongoose.disconnect();
    }
}


// Ejecutar solo si se llama directamente
if (require.main === module) {
    insertSeeds();
}

module.exports = insertSeeds;

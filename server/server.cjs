const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static frontend files

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recipe',
    port: 8889
});

// Handle MySQL connection errors
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    } else {
        console.log('Connected to MySQL');
    }
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const user_id = Math.floor(Math.random() * 1000000);
    console.log(user_id);
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `INSERT INTO users (user_id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)`;
    bcrypt.hash(password, 10, function (err, hash) {
        if(err) {
            console.error('Error hashing password:', err);
            return res.json({ status: 'error', message: 'Password hashing failed' });
        }
        connection.query(mysql.format(sql, [user_id, username, email, hash, created_at]), (err) => {
            if (err) {
                console.error('Error in /register route:', err);
                return res.json({ status: 'error', message: 'Username already taken' });
            }

            res.json({ status: 'success' });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE LOWER(username) = LOWER(?)`;
    
    connection.query(mysql.format(sql, [username, password]), (err, results) => {
        try {
            if (err) {
                res.json({
                    status: 'error',
                    message: 'Invalid username'
                });
                throw new Error('Database query failed');

            }
            
            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        return res.json({ status: 'error', message: 'Login failed' });
                    }

                    if (result) {
                        res.json({
                            status: 'success',
                            userId: user.user_id
                        });
                    } else {
                        res.json({
                            status: 'error',
                            message: 'Incorrect username and password'
                        });
                    }
                });
            } else {
                res.json({
                    status: 'error',
                    message: 'Incorrect username and password'
                });
            }
        } catch (error) {
            console.error('Error in /login route:', error);
            res.json({ status: 'error', message: 'Login failed' });
        }
    });
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 1MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('recipe-image');

// Add this helper function before the /add route
function convertToMinutes(hours, minutes) {
    return (parseInt(hours || 0) * 60) + parseInt(minutes || 0);
}

// Add recipe route
app.post('/add', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ status: 'error', message: err });
        }

        // Parse form data
        const userId = req.body.userId;
        const recipeName = req.body['recipe-name'];
        const recipeDescription = req.body['recipe-description'];
        const recipeCategory = Array.isArray(req.body['recipe-category']) ? req.body['recipe-category'] : [req.body['recipe-category']];
        
        // Convert prep time and cook time to minutes
        const prepTime = convertToMinutes(
            req.body['prep-time-hours'],
            req.body['prep-time-minutes']
        );
        const cookTime = convertToMinutes(
            req.body['cook-time-hours'],
            req.body['cook-time-minutes']
        );
        
        const recipeServings = req.body['recipe-servings'];
        const recipeIngredients = Array.isArray(req.body['recipe-ingredients']) ? req.body['recipe-ingredients'] : [req.body['recipe-ingredients']];
        const recipeInstructions = Array.isArray(req.body['recipe-instructions']) ? req.body['recipe-instructions'] : [req.body['recipe-instructions']];

        console.log(recipeName);
        // Ensure required fields are not null or undefined
        if (!recipeName || !userId) {
            return res.status(400).json({ status: 'error', message: 'Required fields are missing' });
        }

        const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const prep_time = prepTime ? prepTime : 0;
        const cook_time = cookTime ? cookTime : 0;
        const servings = recipeServings ? recipeServings : 0;
        console.log(prepTime);
        console.log(cookTime);
        const sql = "INSERT INTO recipe (recipe_name, description, prep_time, cook_time, servings, created_at, user_id) VALUES (?,?,?,?,?,?,?)";
        connection.query(mysql.format(sql, [recipeName, recipeDescription, prep_time, cook_time, servings, created_at, userId]), (err, results) => {
            if (err) {
                console.error('Error in /add route:', err);
                return res.json({ status: 'error', message: 'Database query failed' });
            }

            const recipeId = results.insertId;
            if (req.file) {
                const newFileName = `recipe-${recipeId}${path.extname(req.file.originalname)}`;
                const newFilePath = path.join('./public/uploads/', newFileName);

                fs.rename(req.file.path, newFilePath, (err) => {
                    if (err) {
                        console.error('Error renaming file:', err);
                        return res.json({ status: 'error', message: 'File renaming failed' });
                    }

                    console.log(`Image saved at: ${newFilePath}`); // Log the file path

                    const ingredients = recipeIngredients.map(ingredient => [recipeId, ingredient]);
                    const instructions = recipeInstructions.map((instruction, index) => [recipeId, index + 1, instruction]);

                    const ingredientsSql = "INSERT INTO recipe_ingredient (recipe_id, ingredient) VALUES ?";
                    const instructionsSql = "INSERT INTO recipe_step (recipe_id, step_number, instruction) VALUES ?";
                    console.log(mysql.format(ingredientsSql, [ingredients]));
                    console.log(mysql.format(instructionsSql, [instructions]));
                    connection.query(mysql.format(ingredientsSql, [ingredients]), (err) => {
                        if (err) {
                            console.error('Error inserting ingredients:', err);
                            return res.json({ status: 'error', message: 'Database query failed' });
                        }

                        connection.query(mysql.format(instructionsSql, [instructions]), (err) => {
                            if (err) {
                                console.error('Error inserting instructions:', err);
                                return res.json({ status: 'error', message: 'Database query failed' });
                            }
                            console.log(recipeCategory);
                            const getCategoryId = "SELECT category_id FROM category WHERE category_name IN (?)";
                            connection.query(mysql.format(getCategoryId, [recipeCategory]), (err, results) => {
                                if (err) {
                                    console.error('Error fetching category:', err);
                                    return res.json({ status: 'error', message: 'Database query failed' });
                                }

                                if (results.length === 0) {
                                    return res.json({ status: 'error', message: 'Category not found' });
                                }

                                const categoryIds = results.map(result => result.category_id);
                                const categorySql = "INSERT INTO recipe_category (recipe_id, category_id) VALUES ?";
                                const categoryValues = categoryIds.map(categoryId => [recipeId, categoryId]);
                                connection.query(mysql.format(categorySql, [categoryValues]), (err) => {
                                    if (err) {
                                        console.error('Error inserting category:', err);
                                        return res.json({ status: 'error', message: 'Database query failed' });
                                    }

                                    const imageSql = "INSERT INTO recipe_images (recipe_id, user_id, image) VALUES (?,?,?)";
                                    connection.query(mysql.format(imageSql, [recipeId, userId, newFilePath]), (err) => {
                                        if (err) {
                                            console.error('Error inserting image:', err);
                                            return res.json({ status: 'error', message: 'Database query failed' });
                                        }

                                        res.json({ status: 'success', recipeId, file: newFileName });
                                    });
                                });
                            });
                        });
                    });
                });
            } else {
                console.error('No file uploaded');
                return res.json({ status: 'error', message: 'No file uploaded' });
            }
        });
    });
});

// recipe category search route
app.get('/searchCategory', (req, res) => {
    const { search, category_name } = req.query;
    console.log(search);
    const sql = `SELECT recipe.* FROM recipe
                JOIN recipe_category on recipe.recipe_id=recipe_category.recipe_id
                JOIN category on recipe_category.category_id=category.category_id 
                WHERE recipe_name LIKE ? AND category_name LIKE ?`;
    connection.query(mysql.format(sql, [`%${search}%`, `${category_name}`]), (err, results) => {
        if (err) {
            console.error('Error in /searchCategory route:', err);
            return res.json({ status: 'error', message: 'Database query failed' });
        }
        console.log(results);
        const imagesSql = `SELECT image FROM recipe_images WHERE recipe_id = ?`;
        const recipes = [];
        let processed = 0;
        results.forEach(recipe => {
            connection.query(mysql.format(imagesSql, [recipe.recipe_id]), (err, images) => {
                if (err) {
                    console.error('Error fetching image:', err);
                    return res.json({ status: 'error', message: 'Database query failed' });
                }
                recipe.image = images.length > 0 ? images[0].image : null;
                recipes.push(recipe);
                processed++;
                if (processed === results.length) {
                    res.json({ status: 'success', recipes });
                }
            });
        });
    });
});

// recipe search route
app.get('/search', (req, res) => {
    const { search } = req.query;
    const sql = `SELECT * FROM recipe WHERE recipe_name LIKE ? LIMIT 6`;
    console.log(search);
    connection.query(mysql.format(sql, [`%${search}%`]), (err, results) => {
        if (err) {
            console.error('Error in /search route:', err);
            return res.json({ status: 'error', message: 'Database query failed' });
        }
        const imagesSql = `SELECT image FROM recipe_images WHERE recipe_id = ?`;
        const recipes = [];
        let processed = 0;
        results.forEach(recipe => {
            connection.query(mysql.format(imagesSql, [recipe.recipe_id]), (err, images) => {
                if (err) {
                    console.error('Error fetching image:', err);
                    return res.json({ status: 'error', message: 'Database query failed' });
                }
                recipe.image = images.length > 0 ? images[0].image : null;
                recipes.push(recipe);
                processed++;
                if (processed === results.length) {
                    res.json({ status: 'success', recipes });
                }
            });
        });
    });
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Category route
app.get('/category/:type', (req, res) => {
    const category = req.params.type.toUpperCase();
     
    console.log('Category selected:', category);
    if (!category) {
        return res.status(400).send('Category type is required');
    }
    console.log(category);
    res.render('category', { category }, (err, html) => {
        if (err) {
            console.error('Error rendering Pug template:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send(html);
    });

});

// recipe data route
app.get('/recipe/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM recipe WHERE recipe_id = ?`;
    connection.query(mysql.format(sql, [id]), (err, results) => {
        if (err) {
            console.error('Error in /recipe/:id route:', err);
            return res.status(500).json({ status: 'error', message: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Recipe not found' });
        }

        const recipe = results[0];
        const ingredientsSql = `SELECT * FROM recipe_ingredient WHERE recipe_id = ?`;
        const instructionsSql = `SELECT * FROM recipe_step WHERE recipe_id = ? ORDER BY step_number`;
        const imageSql = `SELECT image FROM recipe_images WHERE recipe_id = ?`;

        connection.query(mysql.format(ingredientsSql, [id]), (err, ingredients) => {
            if (err) {
                console.error('Error fetching ingredients:', err);
                return res.status(500).json({ status: 'error', message: 'Database query failed' });
            }

            connection.query(mysql.format(instructionsSql, [id]), (err, instructions) => {
                if (err) {
                    console.error('Error fetching instructions:', err);
                    return res.status(500).json({ status: 'error', message: 'Database query failed' });
                }

                connection.query(mysql.format(imageSql, [id]), (err, images) => {
                    if (err) {
                        console.error('Error fetching image:', err);
                        return res.status(500).json({ status: 'error', message: 'Database query failed' });
                    }

                    if (images.length === 0) {
                        recipe.image = null;
                    } else {
                        recipe.image = images[0].image;
                    }

                    const imagePath = recipe.image ? recipe.image.replace('public/', '') : '';

                    res.render('recipe', {
                        recipe_id: recipe.recipe_id,
                        name: recipe.recipe_name.toUpperCase(),
                        prepTime: recipe.prep_time,
                        cookTime: recipe.cook_time,
                        servings: recipe.servings,
                        description: recipe.description,
                        ingredients: ingredients.map(ing => ing.ingredient),
                        instructions: instructions.map(inst => inst.instruction),
                        image: imagePath
                    });
                });
            });
        });
    });
});

// recipe rating route
app.post('/recipe/:id/rate', (req,res) => {
    const { recipe_id, user_id, rating } = req.body;
    
    const sql = `INSERT INTO rating (recipe_id, user_id, rating) VALUES (?,?,?)`;
    connection.query(mysql.format(sql, [recipe_id, user_id, rating]), (err) => {
        if (err) {
            console.error('Error in /rate route:', err);
            return res.json({ status: 'error', message: 'You have already rated this recipe' });
        }

        res.json({ status: 'success' });
    });
});

// Start the server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

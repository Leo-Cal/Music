const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');


// Import routes
const authRoutes = require('./routes/auth');
const composerRoutes = require('./routes/composer');
const formRoutes = require('./routes/form');
const wikiRoutes = require('./routes/wiki');
const swaggerSetup = require('./swagger');

const PORT = process.env.PORT || 8888;

// Initialize express app
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Setup Swagger
swaggerSetup(app);

// Setup routes
app.use('/', authRoutes);
app.use('/composer', composerRoutes);
app.use('/form', formRoutes);
app.use('/wiki', wikiRoutes);

module.exports = app;

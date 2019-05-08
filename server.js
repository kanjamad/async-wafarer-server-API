const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 4000;

// Controllers
const ctrl = require('./controllers');


// ----------------------------- MIDDLEWARE ----------------------------- //
// Protect Headers
app.use(helmet());

//  Express Session Config
app.use(session({
    secret: process.env.SESSION_SECRET || 'Elephant poker championships',
    resave: false,
    saveUninitialized: false,
}));

// BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors
const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


 // ----------------------------- HTML ENDPOINT ----------------------------- //	// ----------------------------- HTML ENDPOINT ----------------------------- //


 // GET Root Route
app.get('/', (req, res) => res.send('<h1>Welcome to Wayfarer API</h1>'));	app.get('/', (req, res) => res.send('<h1>Welcome to Wayfarer API</h1>'));


 // ----------------------------- API ENDPOINT ----------------------------- //

 // Auth Routes
app.use('/api/v1/auth', ctrl.auth);



// ----------------------------- START SERVER ----------------------------- //

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

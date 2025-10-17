const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('./configs/config.env');
const db = require('./configs/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

const port = dotenv.PORT || 8081;

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(cookieParser());

app.use(morgan('dev'));

app.use(session({
    secret: dotenv.SECRET_KEY, 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24} 
}));

app.use('/', require('./routers'));

app.listen(port, (err) => {
    if(!err){
        db();
        console.log("Server start at http://localhost:"+port);   
    }
})
const express = require('express');
const app = express();
const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const router = require('./routes/route');
var session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set("layout","./layouts/layout");

app.use(function (req, res, next) {
  res.locals.user = req.session.User
 
  
  next()
})
app.use('/', router);

app.listen(port, () => {
    console.log("listen " + port);
})
/* Librerías */
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const dateFilter = require("nunjucks-date-filter");
const methodOverride = require("method-override");

const habitaciones = require(__dirname + "/routes/habitaciones");
const limpiezas = require(__dirname + "/routes/limpiezas");
const auth = require(__dirname + "/routes/auth");


dotenv.config();

/* Conexión a la BD */
mongoose.connect(process.env.URLBD);

let app = express();

/* Configuración del motor Nunjucks */
let env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
})

/* Asignación del motor de plantillas */
app.set('view engine', 'njk');

dateFilter.setDefaultFormat("DD/MM/YYYY");
env.addFilter("date", dateFilter);

/*   // Redirección del usuario a la ruta del listado de habitaciones */
app.get("/", (req, res) => {
  res.redirect("/habitaciones");
});


/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

// Configuración de la sesión de la aplicación
app.use(
  session({
    secret: "1234",
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + 30 * 60 * 1000),
  })
);

// Para acceder a la sesión desde las vistas (y poder controlar botones de login y logout)
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

app.use("/habitaciones", habitaciones);
app.use("/limpiezas", limpiezas);
app.use("/auth", auth);

app.listen(process.env.PUERTO);
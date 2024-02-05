/* Librerías */
const express = require("express");
const Habitacion = require(__dirname + "/../models/habitacion.js");
const Limpieza = require(__dirname + "/../models/limpieza.js");
const upload = require(__dirname + "/../utils/uploads.js");

let router = express.Router();

// Middleware para controlar usuario y contraseña
let autenticacion = (req, res, next) => {
  if (req.session && req.session.usuario) return next();
  else res.render("login");
};

/* Listado de todas las habitaciones */
router.get('/', async (req, res) => {
  try {
    const resultado = await Habitacion.find().sort({ numero: 1 });
    if (!resultado || resultado.length == 0) 
        return res.render('error', {error: "No hay habitaciones registradas en la aplicación"});
    else
        return res.render('habitaciones_listado', { habitaciones: resultado })
  } catch (err) {
    return res.render('error', { error: "No hay habitaciones registradas en la aplicación" });
  }
});

// Formulario de nueva habitación
router.get('/nueva', autenticacion, async (req, res) => {
  try {
    const tiposDeHabitacion = await Habitacion.find().distinct('tipo');
    return res.render("habitaciones_nueva", { tiposDeHabitacion });
  } catch(error) {
    return res.render("error", { error: 'Error al obtener los tipos de habitación'})
  }
});

/* Obtener detalles de una habitación concreta */
router.get('/:id', async (req, res) => {
  try {
    const resultado = await Habitacion.findById(req.params.id);
    if (!resultado) {
      return res.render('error', { error: 'No existen habitaciones registradas con ese número de identificación' });
    }
      return res.render('habitaciones_ficha', { habitacion: resultado });
  } catch (error) {
      return res.render('error', { error: 'No existen habitaciones registradas con ese número de identificación' });
  }
});

/* Insertar una habitación */
router.post("/", autenticacion, upload.upload.single("imagen"), async (req, res) => {
  const nuevaHabitacion = new Habitacion({
    numero: req.body.numero,
    tipo: req.body.tipo,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
  });
  if (req.file) nuevaHabitacion.imagen = req.file.filename;
  try {
    const resultado = await nuevaHabitacion.save();
    const habitaciones = await Habitacion.find().sort({ numero: 1 });
    return res.render("habitaciones_listado", { habitaciones });
  } catch (error) {
    try {
      const tiposDeHabitacion = await Habitacion.find().distinct("tipo");
      let errores = {
        general: "Error insertando habitación",
      };
      if (error.errors.numero) {
        errores.numero = error.errors.numero.message;
      }
      if (error.errors.tipo) {
        errores.tipo = error.errors.tipo.message;
      }
      if (error.errors.descripcion) {
        errores.descripcion = error.errors.descripcion.message;
      }
      if (error.errors.precio) {
        errores.precio = error.errors.precio.message;
      }

      return res.render("habitaciones_nueva", {
        errores: errores,
        datos: req.body,
        tiposDeHabitacion,
      });
    } catch (error) {
      return res.render("error", {
        error: "Error al obtener los tipos de habitación, los datos o los errores",
      });
    }
  }
});

/* Actualizar TODAS las últimas limpiezas */
router.put('/ultimaLimpieza', autenticacion,  async (req, res) => {
  try {
    // Obtenemos todas las habitaciones
    const habitaciones = await Habitacion.find();

    // Iteramos sobre cada habitación y actualizamos la última limpieza
    habitaciones.forEach(async habitacion => {
      const ultimaLimpieza = await Limpieza.findOne({idHabitacion: habitacion._id}).sort({ fechaHora: -1 });

      if (ultimaLimpieza) {
        habitacion.ultimaLimpieza = ultimaLimpieza.fechaHora;
        await habitacion.save();
      }
    });
    
    res.status(200).send({ resultado: 'Se han actualizado las ultimas limpiezas realizadas'});

  } catch (error) {
    res.status(400).send({ error: 'Error actualizando limpiezas' });
  } 
});

/* Actualizar los datos de una habitación */
router.put('/:id', autenticacion, upload.upload.single('imagen'), async (req, res) => {
  try {
    const resultado = await Habitacion.findByIdAndUpdate(req.params.id, {
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        ultimaLimpieza: req.body.ultimaLimpieza,
        precio: req.body.precio,
    }, { new: true, runValidators: true });

    if (!resultado) {
        return res.status(400).send({ error: 'Error actualizando los datos de la habitación' });
    }
    res.status(200).send({ resultado: resultado });
  } catch (error) {
      res.status(400).send({ error: 'Error actualizando los datos de la habitación' });
  }
});

/* Eliminar una habitación */
router.delete('/:id', autenticacion, async (req, res) => {
  try {
    const resultado = await Habitacion.findByIdAndDelete(req.params.id);
    if (!resultado) {
        return res.render("error", { error: 'Error eliminando la habitación' });
    }
    res.redirect(req.baseUrl);
  } catch (error) {    
    return res.render("error", { error: 'Error eliminando la habitación' });
  }
});
  
/* Añadir una incidencia a una habitación */
router.post('/:id/incidencias', autenticacion, upload.upload.single("imagen"), async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.id);
    if (!habitacion) {
      return res.render("error", { error: "No se han encontrado habitaciones con ese número de identificación"});
    }

    const incidencia = {
      descripcion: req.body.descripcion,
      fechaInicio: new Date()
    };

    if (req.file) incidencia.imagen = req.file.filename;

    incidencia.fechaInicio.setHours(incidencia.fechaInicio.getHours() + 1);
    
    habitacion.incidencias.push(incidencia);

    const habitacionActualizada = await habitacion.save();
    return res.redirect(`/habitaciones/${habitacionActualizada._id}`);
  } catch (error) {
    try {
      let errores = {
        general: "Error insertando incidencia",
      };
      if (error.errors.descripcion) {
        errores.descripcion = error.errors.descripcion.message;
      }
      if (error.errors.imagen) {
        errores.imagen = error.errors.imagen.message;
      }

      return res.render("error", {error: "La descripción de la incidencia es obligatoria"});
    } catch (error) {
      return res.render("error", { error: "Error al obtener los errores de la incidencia" });
    }
  }
});

/* Actualizar el estado de una incidencia de una habitación */
router.put('/:idH/incidencias/:idI', autenticacion, async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.idH);
    if (!habitacion) {
      return res.status(400).send({ error: 'Incidencia no encontrada' });
    }

    // Búsqueda de la incidencia dentro del array de incidencias de la habitación
    const incidencia = habitacion.incidencias.id(req.params.idI);

    if (!incidencia) {
      return res.render("error", { error: 'Incidencia no encontrada' });
    }

    incidencia.fechaFin = new Date();
    const habitacionActualizada = await habitacion.save();
    return res.redirect(`/habitaciones/${habitacionActualizada._id}`);
  } catch (error) {
    return res.render("error", { error: "Error al actualizar la incidencia"})
  }
});

module.exports = router;

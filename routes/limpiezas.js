/* Librerías */
const express = require('express');

const Limpieza = require(__dirname + "/../models/limpieza.js");
const Habitacion = require(__dirname + "/../models/habitacion.js");

let router = express.Router();

// Middleware para controlar usuario y contraseña
let autenticacion = (req, res, next) => {
  if (req.session && req.session.usuario) return next();
  else res.render("login");
};

/* Limpiezas de una habitación */
router.get('/:id', async (req, res) => {
  try {
    const limpiezas = await Limpieza.find({ idHabitacion: req.params.id }).sort({ fechaHora: -1 });
    const habitacion = await Habitacion.findById(req.params.id);
    return res.render("limpiezas_listado", { limpiezas, habitacion });
  } catch (error) {  
    return res.render('error', { error: 'Error obteniendo las limpiezas asociadas a ese número de habitación' });
  }    
}); 

// Inserción de nueva limpieza
router.post('/:idHabitacion', autenticacion, async (req, res) => {
  const nuevaLimpieza = new Limpieza({
      idHabitacion: req.params.idHabitacion,
      fechaHora: new Date(req.body.fechaHora),
      observaciones: req.body.observaciones,
    });

    nuevaLimpieza.fechaHora.setHours(nuevaLimpieza.fechaHora.getHours() + 1);
  try {
    // Cambiar la fecha de última limpieza de la habitación
    const habitacion = await Habitacion.findById(req.params.idHabitacion);
    habitacion.ultimaLimpieza = nuevaLimpieza.fechaHora;
    await habitacion.save();

    const resultado = await nuevaLimpieza.save();
    const limpiezas = await Limpieza.find({
      idHabitacion: req.params.idHabitacion,
    }).sort({ fechaHora: -1 });
    return res.render("limpiezas_listado", { limpiezas, habitacion });
  } catch(error) {
    try {
      let errores = {
        general: "Error registrando limpieza",
      };
      if (error.errors.fechaHora) {
        errores.fechaHora = error.errors.fechaHora.message;
      }
      if (error.errors.observaciones) {
        errores.observaciones = error.errors.observaciones.message;
      }

      return res.render("limpiezas_nueva", {
        errores: errores,
        datos: req.body,
        idHabitacion: req.params.idHabitacion
      });
    } catch (error) {
      return res.render("error", { error: "Error al obtener los datos o los errores de la limpieza" });
    }
  }
})

// Formulario de nueva limpieza
router.get('/nueva/:id', autenticacion, async (req, res) => {
  try {
    // Obtener la fecha y hora predeterminadas
    const fechaHoraPredeterminada = new Date();
    fechaHoraPredeterminada.setHours(fechaHoraPredeterminada.getHours() + 1);

    // Formatearla en el formato adecuado para datetime-local
    const fechaHoraPredeterminadaFormateada = fechaHoraPredeterminada.toISOString().slice(0, 16);

    return res.render("limpiezas_nueva", { idHabitacion: req.params.id, fechaHoraPredeterminada: fechaHoraPredeterminadaFormateada });
  } catch(error) {
    return res.render("error", { error: 'Error al procesar el formulario de nueva limpieza'})
  }
});

/* Actualizar limpieza */
router.post('/:id', autenticacion, async (req, res) => {
  try {
    let nuevaLimpieza = new Limpieza({ idHabitacion: req.params.id });

    if (req.body.observaciones) {
        nuevaLimpieza.observaciones = req.body.observaciones;
    }

    const resultado = await nuevaLimpieza.save();
    res.status(200).send({ resultado: resultado });
  } catch (error) {    
    res.status(400).send({ error: 'Error actualizando limpieza' });
  }
});

module.exports = router;

    
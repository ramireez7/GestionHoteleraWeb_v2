/* Esquema y modelo de Usuarios */

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  login: {
    type: String,
    trim:true,
    required: true,
    unique: true,
    min: 4    
  },
  password: {
    type: String,
    trim: true,
    required: true,
    min: 7
  }
});

const Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;
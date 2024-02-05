/* Esquema y modelo acerca de las limpiezas realizadas por habitación */

const mongoose = require("mongoose");

let limpiezaSchema = new mongoose.Schema ({

    /* referencia de la habitación */
    idHabitacion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'habitaciones'            
    },
    /* fecha y hora de la limpieza */
    fechaHora: {
        type: Date,
        required: [true, "Este campo es obligatorio"],
        default: Date.now()
    },
    /* observaciones sobre la limpieza */
    observaciones: {
        type: String,
        trim: true,
        required: false,        
    }
});

let Limpieza = mongoose.model('limpiezas', limpiezaSchema);

module.exports = Limpieza;
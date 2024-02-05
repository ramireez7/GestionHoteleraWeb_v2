const mongoose = require('mongoose');
const Habitacion = require(__dirname + "/models/habitacion");
const Limpieza = require(__dirname + "/models/limpieza");
const Usuario = require(__dirname + "/models/usuario");

mongoose.connect('mongodb://127.0.0.1:27017/hotel');

let habitaciones = [
    new Habitacion({
        id: "1a1a1a1a1a1a1a1a1a1a1a1a",
        numero: 1,
        tipo: "doble",
        descripcion: "Habitación doble, cama XL, terraza con vistas al mar",
        ultimaLimpieza: new Date("2023-09-20T11:24:00Z"),
        precio: 59.90,
        incidencias: [
            {id: "10011a1a1a1a1a1a1a1a1a1a",
             descripcion: "No funciona el aire acondicionado",
             fechaInicio: new Date("2023-09-19T18:12:54Z")},
            {id: "10021a1a1a1a1a1a1a1a1a1a",
             descripcion: "No funciona el interruptor del aseo",
             fechaInicio: new Date("2023-09-20T10:15:06Z")}
        ]
    }),
    new Habitacion({
        id: "2b2b2b2b2b2b2b2b2b2b2b2b",
        numero: 2,
        tipo: "familiar",
        descripcion: "Habitación familiar, cama XL y literas, aseo con bañera",
        ultimaLimpieza: new Date("2023-08-02T10:35:15Z"),
        precio: 65.45
    }),
    new Habitacion({
        id: "3c3c3c3c3c3c3c3c3c3c3c3c",
        numero: 3,
        tipo: "familiar",
        descripcion: "Habitación familiar, cama XL y sofá cama, cocina con nevera",
        precio: 69.15
    }),
    new Habitacion({
        id: "4d4d4d4d4d4d4d4d4d4d4d4d",
        numero: 4,
        tipo: "suite",
        descripcion: "Habitación con dos camas XL, terraza y vistas al mar",
        ultimaLimpieza: new Date("2023-10-10T12:05:10Z"),
        precio: 110.20,
        incidencias: [
            {id: "10014d4d4d4d4d4d4d4d4d4d",
             descripcion: "No funciona el jacuzzi",
             fechaInicio: new Date("2023-10-08T19:24:43Z")}
        ]
    }),
    new Habitacion({
        id: "5e5e5e5e5e5e5e5e5e5e5e5e",
        numero: 5,
        tipo: "individual",
        descripcion: "Habitación simple, cama 150",
        precio: 34.65
    })
];

let limpiezas = [
    new Limpieza({
        id: "20011a1a1a1a1a1a1a1a1a1a",
        idHabitacion: "1a1a1a1a1a1a1a1a1a1a1a1a",
        fechaHora: new Date("2023-09-18T10:59:12Z"),
        observaciones: "Dejan toallas para cambiar"
    }),
    new Limpieza({
        id: "20021a1a1a1a1a1a1a1a1a1a",        
        idHabitacion: "1a1a1a1a1a1a1a1a1a1a1a1a",
        fechaHora: new Date("2023-09-20T11:24:00Z")
    }),
    new Limpieza({
        id: "20012b2b2b2b2b2b2b2b2b2b",
        idHabitacion: "2b2b2b2b2b2b2b2b2b2b2b2b",
        fechaHora: new Date("2023-08-02T10:35:15Z"),
        observaciones: "Desperfectos en puerta del aseo"
    }),
    new Limpieza({
        id: "20013c3c3c3c3c3c3c3c3c3c",
        idHabitacion: "3c3c3c3c3c3c3c3c3c3c3c3c"
    }),
    new Limpieza({
        id: "20014d4d4d4d4d4d4d4d4d4d",
        idHabitacion: "4d4d4d4d4d4d4d4d4d4d4d4d",
        fecha: new Date("2023-10-09T11:00:25Z")
    }),
    new Limpieza({
        id: "20024d4d4d4d4d4d4d4d4d4d",
        idHabitacion: "4d4d4d4d4d4d4d4d4d4d4d4d",
        fechaHora: new Date("2023-10-10T12:05:10Z")
    }),
    new Limpieza({
        id: "20015e5e5e5e5e5e5e5e5e5e",
        idHabitacion: "5e5e5e5e5e5e5e5e5e5e5e5e"
    }),
];

let usuarios = [
    new Usuario({
        login: "usuario1",
        password: "11111111"
    }),
    new Usuario({
        login: "usuario2",
        password: "22222222"
    }),
    new Usuario({
        login: "usuario3",
        password: "33333333"
    })
]        

habitaciones.forEach(h => h.save());
limpiezas.forEach(l => l.save());
usuarios.forEach(u => u.save());

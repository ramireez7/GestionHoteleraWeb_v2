/* Librerías */
const express = require("express");
const Usuario = require(__dirname + "/../models/usuario.js");

let router = express.Router();

/* Login */
router.get("/login", async (req, res) => {
    return res.render("login");
});

// Proceso de login (obtener credenciales y cotejar)
router.post("/login", async (req, res) => {
  let login = req.body.login;
  let password = req.body.password;

  try {
    const usuarios = await Usuario.find();

    let existeUsuario = usuarios.filter(
      (usuario) => usuario.login == login && usuario.password == password
    );
    console.log(usuarios);
    console.log(existeUsuario);

    if (existeUsuario) {
      req.session.usuario = existeUsuario[0].login;
      console.log(existeUsuario[0].login);
      return res.redirect("/habitaciones");
    } else {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }
  } catch(error) {
    return res.render("error", { error: "Error en el proceso de login"});
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;

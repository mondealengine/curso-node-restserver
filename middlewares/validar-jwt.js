const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const usuario = require("../models/usuario");

const validarJWT = async (req = Request, res = Response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.json({
      msg: "No hay token",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    //verificar si el uid tiene estado en true
    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe en DB",
      });
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario con estado:false",
      });
    }
    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = { validarJWT };

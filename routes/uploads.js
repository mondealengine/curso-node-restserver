const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require("../controllers/uploads");
const { validarJWT, validarArchivo, validarCampos } = require("../middlewares");
const { coleccionesPermitidas } = require("../helpers");

const router = Router();

router.post("/", [validarJWT, validarArchivo], cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    // validarJWT,
    check("id", "No es un id de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarArchivo,
    validarCampos,
  ],
  actualizarImagenCloudinary
);

router.get('/:coleccion/:id', [
    check("id", "No es un id de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
],
    mostrarImagen
)

module.exports = router;

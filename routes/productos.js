const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const {
  existeCategoriaPorNombre,
  existeProductoPorId,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", obtenerProductos);

router.get(
  "/:id",
  [
    check("id", "id no válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("categoria", "la categoria es obligatoria").not().isEmpty(),
    check("categoria").custom(existeCategoriaPorNombre),
    check("precio", "El precio debe ser mayor a cero")
      .optional()
      .isFloat({ min: 0 }),
    check("disponible", "disponible debe ser un booleano")
      .optional()
      .isBoolean(),
    validarCampos,
  ],
  crearProducto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "id no válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    check("categoria").optional().custom(existeCategoriaPorNombre),
    validarCampos,
  ],
  actualizarProducto
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "id no válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;

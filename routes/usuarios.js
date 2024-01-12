const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
} = require("../controllers/usuarios");


const { validarCampos } = require("../middlewares/validar-campos");
const { esRolValido, emailExiste, usuarioExistePorId } = require("../helpers/db-validators");

const router = Router();

router.get("/", usuariosGet);

router.post(
  "/",
  [
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    check("password", "El password debe de ser de mas de 6 letras").isLength({
      min: 6,
    }),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    // check("rol", "El rol no es válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPost
);

router.put("/:id", 
[
check("id", "El id no es válido").isMongoId(),
check("id").custom(usuarioExistePorId),
check("rol").custom(esRolValido),
validarCampos,
],
usuariosPut);

router.patch("/", usuariosPatch);

router.delete("/:id", 
[
  check("id", "El id no es válido").isMongoId(),
  check("id").custom(usuarioExistePorId),
  validarCampos,
], usuariosDelete);

module.exports = router;



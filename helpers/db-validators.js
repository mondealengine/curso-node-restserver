const { Categoria, Usuario, Role, Producto } = require("../models");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado`);
  }
};

const usuarioExistePorId = async (id = "") => {
  const existeId = await Usuario.findById(id);
  if (!existeId) {
    throw new Error(`El usuario con id ${id} no existe`);
  }
};

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`La categoria con id ${id} no existe`);
  }
};

const existeCategoriaPorNombre = async (nombre) => {
  const existeCategoria = await Categoria.findOne({
    nombre: nombre.toUpperCase(),
  });
  if (!existeCategoria) {
    throw new Error(`La categoria con nombre ${nombre} no existe`);
  }
};

const existeProductoPorId = async (id) => {
  const existeProduco = await Producto.findById(id);
  if (!existeProduco) {
    throw new Error(`El producto con id ${id} no existe`);
  }
};

module.exports = {
  esRolValido,
  emailExiste,
  usuarioExistePorId,
  existeCategoriaPorId,
  existeCategoriaPorNombre,
  existeProductoPorId,
};

const { response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async (req, res = response) => {
  const { skip, limit } = req.query;

  const query = { estado: true };

  const [categorias, total] = await Promise.all([
    Categoria.find(query).populate("usuario", "nombre").skip(skip).limit(limit),
    Categoria.countDocuments(query),
  ]);

  res.json({
    total,
    categorias,
  });
};

const obtenerCategoria = async (req, res = response) => {
  const id = req.params.id;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json({
    categoria,
  });
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  //Guardar DB
  await categoria.save();

  res.status(201).json(categoria);
};

const actualizarCategoria = async (req, res = response) => {
  const id = req.params.id;
  const {estado, usuario, ...data} = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
     data ,
    { new: true }
  );
    
  res.status(200).json({
    categoria,
  });
};

const borrarCategoria = async (req, res) => {
  const id = req.params.id;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    categoria,
  });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};

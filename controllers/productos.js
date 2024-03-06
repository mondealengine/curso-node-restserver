const { Categoria, Producto } = require("../models");

const obtenerProductos = async (req, res) => {
  const { limit, skip } = req.query;
  const query = { estado: true };
  const [productos, total] = await Promise.all([
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(skip)
      .limit(limit),
    Producto.countDocuments(query),
  ]);

  res.json({ total, productos });
};

const obtenerProducto = async (req, res) => {
  const id = req.params.id;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(producto);
};

const crearProducto = async (req, res) => {
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.categoria = data.categoria.toUpperCase();

  const maybeProducto = await Producto.findOne({ nombre: data.nombre });

  if (maybeProducto) {
    return res.status(400).json({
      msg: `Ya existe un producto con el nombre ${nombre}`,
    });
  }

  const categoriaDb = await Categoria.findOne({
    nombre: data.categoria,
  });

  const producto = {
    ...data,
    categoria: categoriaDb.id,
    usuario: req.usuario.id
  };

  const productoDb = new Producto(producto);
  await productoDb.save();

  res.json(productoDb);
};

const actualizarProducto = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      msg: "The body is empty",
    });
  }

  const id = req.params.id;
  const { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  if (data.categoria) {
    data.categoria = await Categoria.findOne({
      nombre: data.categoria.toUpperCase(),
    });
  }

  data.usuario = req.usuario._id;

  const productoActualizado = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  });

  res.json(productoActualizado);
};

const borrarProducto = async (req, res) => {
  const id = req.params.id;
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(producto);
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};

const path = require("path");
const fs = require("fs");
const { response } = require("express");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const usuario = require("../models/usuario");

const cargarArchivo = async (req, res = response) => {
  try {
    // const nombre = await subirArchivo(req.files, ["txt", "md"], 'textos');
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({ nombre });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

const getModelo = async (req, res) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe usuario con id ${id}` });
      }
      // return modelo
      break;
    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: `No existe producto con id ${id}` });
      }
      // return modelo
      break;

    default:
      res.status(500).json({ error: "Se me olvidó este caso" });
      break;
  }

  return modelo;
};

const actualizarImagen = async (req, res = response) => {
  const { coleccion } = req.params;
  const modelo = await getModelo(req, res);

  //limpiar imágenes previas
  if (modelo.img) {
    //Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { coleccion } = req.params;
  const modelo = await getModelo(req, res);

  //limpiar imágenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;
  await modelo.save();
  res.json(modelo);
};

const mostrarImagen = async (req, res) => {
  const { coleccion } = req.params;

  const modelo = await getModelo(req, res);

  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathImageNoImage = path.join(__dirname, "../assets/no-image.jpg");

  res.sendFile(pathImageNoImage);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};

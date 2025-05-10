const Libro = require('../models/Book');

const crearLibro = async (req, res) => {
  try {
    const usuario = req.usuario;

    if (!usuario.permisos.crearLibros) {
      return res.status(403).json({ mensaje: 'No tienes permiso para crear libros' });
    }

    const {
      nombre,
      autor,
      genero,
      editorial,
      fechaPublicacion
    } = req.body;

    if (!nombre || !autor) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const nuevoLibro = new Libro({
      nombre,
      autor,
      genero,
      editorial,
      fechaPublicacion
    });

    await nuevoLibro.save();
    res.status(201).json({ mensaje: 'Libro creado correctamente', libro: nuevoLibro });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear libro' });
  }
};

// Obtener un solo libro por ID
const obtenerLibroPorId = async (req, res) => {
  try {
    const libro = await Libro.findOne({ _id: req.params.id, habilitado: true });
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    res.json(libro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al buscar libro' });
  }
};

// Obtener libros con filtros (y excluyendo los inhabilitados)
const obtenerLibros = async (req, res) => {
  try {
    const filtros = { habilitado: true };

    // Filtros dinámicos
    if (req.query.genero) filtros.genero = req.query.genero;
    if (req.query.autor) filtros.autor = req.query.autor;
    if (req.query.editorial) filtros.editorial = req.query.editorial;
    if (req.query.nombre) filtros.nombre = new RegExp(req.query.nombre, 'i'); // búsqueda por nombre parcial
    if (req.query.disponible) filtros.disponible = req.query.disponible === 'true';
    if (req.query.fechaPublicacion) filtros.fechaPublicacion = new Date(req.query.fechaPublicacion);

    const libros = await Libro.find(filtros);
    res.json(libros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al filtrar libros' });
  }
};

const actualizarLibro = async (req, res) => {
  try {
    const usuario = req.usuario;

    if (!usuario.permisos.modificarLibros) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar libros' });
    }

    const { id } = req.params;
    const campos = ['nombre', 'autor', 'genero', 'editorial', 'fechaPublicacion', 'disponible'];
    const cambios = {};

    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        cambios[campo] = req.body[campo];
      }
    });

    const libro = await Libro.findByIdAndUpdate(id, cambios, { new: true });

    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });

    res.json({ mensaje: 'Libro actualizado', libro });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar libro' });
  }
};

const inhabilitarLibro = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { id } = req.params;

    if (!usuario.permisos.inhabilitarLibros) {
      return res.status(403).json({ mensaje: 'No tienes permiso para inhabilitar libros' });
    }

    const libroInhabilitado = await Libro.findByIdAndUpdate(
      id,
      { habilitado: false },
      { new: true }
    );

    if (!libroInhabilitado) return res.status(404).json({ mensaje: 'Libro no encontrado' });

    res.json({ mensaje: 'Libro inhabilitado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al inhabilitar libro' });
  }
};

module.exports = {
  crearLibro,
  obtenerLibroPorId,
  obtenerLibros,
  actualizarLibro,
  inhabilitarLibro
};
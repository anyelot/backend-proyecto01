const express = require('express');
const router = express.Router();
const { createUser, loginUser, actualizarUsuario, inhabilitarUsuario } = require('../controllers/userController');
const protegerRuta = require('../middleWare/authMiddleware');

router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/:id', protegerRuta, actualizarUsuario); // actualizar usuario
router.delete('/:id', protegerRuta, inhabilitarUsuario);

module.exports = router;
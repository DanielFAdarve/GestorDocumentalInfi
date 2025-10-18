const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../database");
const dotenv = require("dotenv");

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "daniel";

class AuthController {
  // Login
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Validar entrada
      if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son obligatorios" });
      }

      // Buscar usuario
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      // Validar contraseña
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, user_type: user.user_type },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      return res.json({ token });
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Registro
  async register(req, res) {
    const { name, email, password, user_type } = req.body;

    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
      }

      // Verificar que no exista
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: "El correo ya está registrado" });
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        user_type: user_type || "normal"
      });

      return res.status(201).json({
        message: "Usuario creado correctamente",
        user: { id: newUser.id, name: newUser.name, email: newUser.email, user_type: newUser.user_type }
      });
    } catch (error) {
      console.error("Error en register:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = new AuthController();

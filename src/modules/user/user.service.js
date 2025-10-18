const AppError = require('../../core/errors/AppError');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    return user;
  }

  async getUserByEmail(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    return user;
  }

  async createUser(data) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new AppError('El correo electrónico ya está registrado', 400);

    return this.userRepository.create(data);
  }

  async updateUser(id, updates) {
    const user = await this.userRepository.update(id, updates);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    return user;
  }

  async deleteUser(id) {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) throw new AppError('Usuario no encontrado', 404);
    return { message: 'Usuario eliminado correctamente' };
  }

  async authenticate(email, password, jwtHelper) {
    if (!email || !password) throw new AppError('Email y contraseña son requeridos', 400);

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('Credenciales inválidas', 401);

    // Usa el método del modelo para comparar
    const validPassword = await user.validatePassword(password);
    if (!validPassword) throw new AppError('Credenciales inválidas - Contraseña incorrecta', 401);

    const token = jwtHelper.generateToken({ id: user.id, email: user.email });
    return { token, user: user.toJSON() };
  }
}

module.exports = UserService;

class UserRepository {
  constructor(UserModel) {
    this.User = UserModel;
  }

  async findAll() {
    return this.User.findAll();
  }

  async findById(id) {
    return this.User.findByPk(id);
  }

  async findByEmail(email) {
    return this.User.findOne({ where: { email } });
  }

  async create(userData) {
    return this.User.create(userData);
  }

  async update(id, updates) {
    const user = await this.findById(id);
    if (!user) return null;
    return user.update(updates);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) return null;
    await user.destroy();
    return true;
  }
}

module.exports = UserRepository;

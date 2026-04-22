const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(prisma) {
    this.prisma = prisma;
    this.jwtSecret = process.env.JWT_SECRET || 'supersecretkey';
  }

  async register(email, password, role, specialization) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('USER_ALREADY_EXISTS');

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role ? role.toUpperCase() : 'PATIENT';

    const userData = {
      email,
      password: hashedPassword,
      role: userRole,
    };

    if (userRole === 'DOCTOR') {
      userData.doctorProfile = {
        create: { specialization: specialization || 'General Medicine' },
      };
    } else if (userRole === 'PATIENT') {
      userData.patientProfile = { create: {} };
    }

    const newUser = await this.prisma.user.create({ data: userData });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async login(email, password) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('INVALID_CREDENTIALS');

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      this.jwtSecret,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = AuthService;

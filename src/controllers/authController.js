const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

async function register(req, res) {
  try {
    const { email, password, role, specialization } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Ensure role defaults to PATIENT and matches the Prisma Role enum
    const userRole = role ? role.toUpperCase() : 'PATIENT';

    const userData = {
      email,
      password: hashedPassword,
      role: userRole,
    };

    // Use Prisma nested writes to automatically create the related profile
    if (userRole === 'DOCTOR') {
      userData.doctorProfile = {
        create: {
          specialization: specialization || 'General Medicine', // Required field
        },
      };
    } else if (userRole === 'PATIENT') {
      userData.patientProfile = {
        create: {},
      };
    }

    // Create the User (and profile transactionally)
    const newUser = await prisma.user.create({
      data: userData,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Retrieve user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Sign a JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } // Expires in 1 day
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
}

module.exports = {
  register,
  login
};

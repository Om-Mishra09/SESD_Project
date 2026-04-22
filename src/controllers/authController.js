class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res) => {
    const { email, password, role, specialization } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await this.authService.register(email, password, role, specialization);

      return res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      if (error.message === 'USER_ALREADY_EXISTS') {
        return res.status(400).json({ error: 'User already exists' });
      }

      console.error('Registration Error:', error);
      return res.status(500).json({ error: 'Internal server error during registration' });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const { token, user } = await this.authService.login(email, password);

      return res.json({
        message: 'Login successful',
        token,
        user,
      });
    } catch (error) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      console.error('Login Error:', error);
      return res.status(500).json({ error: 'Internal server error during login' });
    }
  };
}

module.exports = AuthController;

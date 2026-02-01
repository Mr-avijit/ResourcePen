const AuthService = require('./auth.service');
const { success, error } = require('../../core/responses');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return success(res, result, 'Identity authorized.');
    } catch (err) {
      return error(res, err.message, 401, 'AUTH_FAILED');
    }
  }

  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      return success(res, result, 'Identity created in genesis.', 201);
    } catch (err) {
      return error(res, err.message, 400, 'REGISTRATION_FAILED');
    }
  }
}

module.exports = new AuthController();
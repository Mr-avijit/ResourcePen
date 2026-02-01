const UserService = require('./user.service');
const { success } = require('../../core/responses');

class UserController {
  async me(req, res, next) {
    try {
      const profile = await UserService.getProfile(req.user.id);
      return success(res, profile, 'Identity profile retrieved.');
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await UserService.updateProfile(req.user.id, req.body);
      return success(res, updated, 'Identity updated.');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    login: function UserLogin(req, res) {

        var params = req.allParams();

        var identifier = params.email || params.username;

        User.login(identifier, params.password).then(function(authToken) {
            return res.created(authToken);
        }).catch(function(e) {
            return res.badRequest('Username or password is incorrect');
        });
    },

    logout: function UserLogout(req, res) {
        User.logout(res.locals.authToken.owner).then(function() {
            return res.ok();
        }).catch(function(e) {
            return res.serverError('Problem signing out');
        });
    }
};
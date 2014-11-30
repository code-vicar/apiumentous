/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    // TODO - turn this into a generic service
    function deleteAuthTokenParams() {
        delete req.query.authToken
        delete req.query.authTokenTime
        delete req.query.authTokenHash

        delete req.params.authToken
        delete req.params.authTokenTime
        delete req.params.authTokenHash

        delete req.body.authToken
        delete req.body.authTokenTime
        delete req.body.authTokenHash
    }

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller

    var params = req.allParams();
    if (!params.authToken || !params.authTokenTime || !params.authTokenHash) {
        // User is not allowed
        // (default res.forbidden() behavior can be overridden in `config/403.js`)
        return res.forbidden('You are not permitted to perform this action.');
    }

    AuthToken.findOne(params.authToken).then(function(token) {
        return [token, token.verifyTokenHash(params.authTokenTime, params.authTokenHash)];
    }).spread(function(token, isValid) {
        if (!isValid) {
            throw new Error('Invalid token');
        }
        deleteAuthTokenParams();
        res.locals.authToken = token;
        next();
    }).catch(function(e) {
        return res.forbidden('Invalid token.');
    });
};
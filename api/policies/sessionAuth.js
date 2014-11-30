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
        delete req.params.authToken
        delete req.body.authToken
    }

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    var params = req.allParams();
    if (!params.authToken) {
        // User is not allowed
        // (default res.forbidden() behavior can be overridden in `config/403.js`)
        return res.forbidden('You are not permitted to perform this action.');
    }

    AuthToken.findOne({
        tokenData: params.authToken
    }).then(function(token) {
        // Ensure the token hasn't expired
        var timeDiff = token.expiresAt - (new Date());
        if (timeDiff <= 0) {
            return res.forbidden('Invalid token.');
        }

        // remove the token info from the request
        deleteAuthTokenParams();

        // add the token model to the response locals so we can access it later
        //   for looking up the authenticated user of the request...
        res.locals.authToken = token;

        next();
    }).catch(function(e) {
        return res.forbidden('Invalid token.');
    });
};
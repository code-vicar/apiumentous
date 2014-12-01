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
    'use strict';
    /* global AuthToken */
    // TODO - turn this into a generic service
    function deleteAuthTokenParams() {
        if (req.query && req.query.authToken) {
            delete req.query.authToken;
        }
        if (req.params && req.params.authToken) {
            delete req.params.authToken;
        }
        if (req.body && req.body.authToken) {
            delete req.body.authToken;
        }
    }

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    var params = req.allParams();
    if (!req.isSocket) {
        params.authToken = params.authToken || req.get('authToken');
    }
    if (!params.authToken) {
        // User is not allowed
        // (default res.forbidden() behavior can be overridden in `config/403.js`)
        return res.forbidden('You are not permitted to perform this action.');
    }

    AuthToken.findOne({
        tokenData: params.authToken
    }).then(function(token) {
        if (!token) {
            return res.forbidden('You are not permitted to perform this action.');
        }
        // Ensure the token hasn't expired
        var timeDiff = token.expiresAt - (new Date());
        if (timeDiff <= 0) {
            return res.forbidden('Token expired.');
        }

        // remove the token info from the request
        deleteAuthTokenParams();

        // add the token model to the response locals so we can access it later
        //   for looking up the authenticated user of the request...
        res.locals.authToken = token;

        next();
    }).catch(function(e) {
        req._sails.log.debug(e);
        return res.forbidden('You are not permitted to perform this action.');
    });
};
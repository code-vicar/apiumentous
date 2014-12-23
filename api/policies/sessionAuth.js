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

    var params = req.allParams();
    if (!req.isSocket) {
        // check the header if this isn't a socket request
        params.authToken = params.authToken || req.get('authToken');
    }

    // clean up the auth token value so it doesn't leak through
    //   when provided in the body/query of a request
    req = APIHelper.deleteAuthTokenParams(req);

    if (!params.authToken) { // require an authtoken
        return res.forbidden('You are not permitted to perform this action.');
    }

    AuthToken.findOne({
        tokenData: params.authToken
    }).then(function(token) {
        if (!token) {  // didn't find the provided authtoken
            return res.forbidden('You are not permitted to perform this action.');
        }
        // Ensure the token hasn't expired
        var timeDiff = token.expiresAt - (new Date());
        if (timeDiff <= 0) {
            // token expired, send 401 so they know to re-authorize
            return res.unauthorized('Unauthorized');
        }

        // add the token model to the response locals so we can access it later
        //   for looking up the authenticated user of the request...
        res.locals.authToken = token;

        // User is allowed, proceed to the next policy,
        // or if this is the last policy, the controller
        next();
    }).catch(function(e) {
        req._sails.log.debug(e);
        return res.forbidden('You are not permitted to perform this action.');
    });
};

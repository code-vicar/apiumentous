'use strict';
module.exports = {
    deleteAuthTokenParams: function (req) {
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
};

var uuid = require('node-uuid');
var moment = require('moment');

/**
 * AuthToken.js
 *
 * @description :: Api authentication token
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        tokenData: {
            type: 'string'
        },
        expiresAt: {
            type: 'datetime'
        },
        owner: {
            model: 'user'
        }
    },

    beforeCreate: function authTokenBeforeCreate(values, cb) {
        values.tokenData = uuid.v4();
        values.expiresAt = moment().add(30, 'minutes').toDate();
        cb();
    }
};
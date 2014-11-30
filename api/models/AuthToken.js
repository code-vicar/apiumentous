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
            type: 'string',
            required: true
        },
        expiresAt: {
            type: 'datetime',
            required: true
        },
        owner: {
            model: 'user'
        }
    },

    beforeCreate: function authTokenBeforeCreate(values, cb) {
        values.tokenData = uuid.v4();
        values.expiresAt = moment().add(30, 'minutes');
    }
};
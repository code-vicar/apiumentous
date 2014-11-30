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
        privateKey: {
            type: 'string',
            required: true
        },
        expiresAt: {
            type: 'date',
            required: true
        },
        owner: {
            model: 'user'
        }
    },

    beforeCreate: function authTokenBeforeCreate(values, cb) {
        values.privateKey = uuid.v4();
        values.expiresAt = moment().add(30, 'minutes');
    }
};
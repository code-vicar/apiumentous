'use strict';
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));

/**
 * User.js
 *
 * @description :: Authenticated users
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true,
            regex: /^[a-z0-9_-]{3,15}$/
        },
        password: {
            type: 'string',
            required: true,
            minLength: 8,
            regex: /\d/
        },
        email: {
            type: 'string',
            email: true,
            unique: true
        },
        messages: {
            collection: 'chatmessage',
            via: 'author'
        },
        authTokens: {
            collection: 'authtoken',
            via: 'owner'
        }
    },

    validateCredentials: function validateCredentials(identifier, password) {
        return User.findOne().where({
            or: [{
                username: identifier
            }, {
                email: identifier
            }]
        }).then(function(user) {
            return [user, bcrypt.hash(password, 10)];
        }).spread(function(user, hash) {
            return [user, user.password === hash];
        });
    },

    login: function(identifier, password) {
        return User.validateCredentials(identifier, password).spread(function(user, isValid) {
            if (!isValid) {
                throw new Error('Incorrect Password');
            }

            return AuthToken.create({
                owner: user
            });
        });
    },

    logout: function(user) {
        return AuthToken.destroy({
            owner: user
        });
    },

    beforeCreate: function(values, cb) {

        // ensure the password matches confirmation
        if (values.password !== values.passwordConfirmation) {
            cb('Password doesn\'t match confirmation');
        }

        // Encrypt password
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return cb(err);
            }
            values.password = hash;
            //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
            cb();
        });
    }
};
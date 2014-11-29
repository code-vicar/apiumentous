var bcrypt = require('bcrypt');
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
            unique: true
        },
        password: {
            type: 'string',
            required: true,
            minLength: 8,
            regex: /\d/
        },
        passwordConfirmation: {
            type: 'string'
        },
        email: {
            type: 'string',
            email: true,
            unique: true
        },
        messages: {
            collection: 'chatmessage',
            via: 'author'
        }
    },

    beforeCreate: function(values, cb) {

        // ensure the password matches confirmation
        if (values.password !== values.passwordConfirmation) {
            cb('Password doesn\'t match confirmation');
        }

        // Encrypt password
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) return cb(err);
            values.password = hash;
            //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
            cb();
        });
    }
};
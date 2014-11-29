/**
 * ChatMessage.js
 *
 * @description :: A message in the chat system
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        author: {
            model: 'user'
        },
        message: {
            type: 'string',
            required: true
        }
    }
};
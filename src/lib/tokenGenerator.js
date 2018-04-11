/**
 * Created by StarkX on 08-Apr-18.
 */
const crypto = require('crypto');
const bluebird = require('bluebird');

const randomBytes = bluebird.promisify(crypto.randomBytes);

module.exports = () => {
    return randomBytes(256)
        .then((buffer) => {
            return crypto
                .createHash('sha1')
                .update(buffer)
                .digest('hex');
        });
};
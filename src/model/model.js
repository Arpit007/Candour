/**
 * Created by StarkX on 09-Apr-18.
 */

module.exports = global.Model = {
    Token : require('./controller/token'),
    AuthClient : require('./controller/authClient'),
    AuthCode : require('./controller/authCode'),
    AuthScope : require('./controller/authScope'),
    User : require('./controller/user')
};
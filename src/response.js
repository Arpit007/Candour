/**
 * Created by StarkX on 09-Mar-18.
 */

global.Response = module.exports.Response = (code = 200, body = {}, msg = '') => {
    let reply = {
        head : {
            code : code,
            msg : msg || (code === 200 ? 'ok' : '')
        },
        body : {}
    };
    if (typeof(body) === 'string')
        reply.head.msg = body;
    else reply.body = body;
    return reply;
};

global.ResponseReply = module.exports.ResponseReply = (res, code = 200, body = {}, msg = '') => {
    let reply = {
        head : {
            code : code,
            msg : msg || (code === 200 ? 'ok' : '')
        },
        body : {}
    };
    if (typeof(body) === 'string')
        reply.head.msg = body;
    else reply.body = body;
    res.status(code).json(reply);
};
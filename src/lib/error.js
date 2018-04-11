/**
 * Created by StarkX on 08-Apr-18.
 */
class DefaultError {
    constructor(reason) {
        this.head = { code : 500, msg : "" };
        this.body = { reason : reason };
    }
}

class InvalidArgumentError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.msg = "Invalid Arguement";
    }
}

class InsufficientScopeError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 403;
        this.head.msg = "Insufficient Scope";
    }
}

class AccessDeniedError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "Access Denied";
    }
}

class InvalidClientError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "Invalid Client";
    }
}

class InvalidGrantError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "Invalid Grant";
    }
}

class InvalidRequestError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "Invalid Request";
    }
}

class InvalidScopeError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "Invalid Scope";
    }
}

class InvalidTokenError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 401;
        this.head.msg = "Invalid Token";
    }
}

class UnsupportedResponseTypeError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "Unsupported Response Type";
    }
}

class UnsupportedGrantTypeError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "Unsupported Grant Type";
    }
}

class UnauthorizedRequestError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 401;
        this.head.msg = "Unsupported Request";
    }
}

class UnauthorizedClientError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "Unsupported Client";
    }
}

class ServerError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 503;
        this.head.msg = "Server Error";
    }
}

module.exports = {
    DefaultError : DefaultError,
    InvalidArgumentError : InvalidArgumentError,
    InsufficientScopeError : InsufficientScopeError,
    AccessDeniedError : AccessDeniedError,
    InvalidClientError : InvalidClientError,
    InvalidGrantError : InvalidGrantError,
    InvalidRequestError : InvalidRequestError,
    InvalidScopeError : InvalidScopeError,
    InvalidTokenError : InvalidTokenError,
    UnsupportedResponseTypeError : UnsupportedResponseTypeError,
    UnsupportedGrantTypeError : UnsupportedGrantTypeError,
    UnauthorizedRequestError : UnauthorizedRequestError,
    UnauthorizedClientError : UnauthorizedClientError,
    ServerError : ServerError
};
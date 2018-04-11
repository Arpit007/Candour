/**
 * Created by StarkX on 08-Apr-18.
 */
class DefaultError extends Error {
    constructor(reason) {
        super();
        this.head = { code : 500, msg : "" };
        this.body = { reason : reason };
    }
}

class InvalidArgumentError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.msg = "invalid_argument";
    }
}

class InsufficientScopeError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 403;
        this.head.msg = "insufficient_scope";
    }
}

class AccessDeniedError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "access_denied";
    }
}

class InvalidClientError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "invalid_client";
    }
}

class InvalidGrantError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "invalid_grant";
    }
}

class InvalidRequestError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "invalid_request";
    }
}

class InvalidScopeError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "invalid_scope";
    }
}

class InvalidTokenError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 401;
        this.head.msg = "invalid_token";
    }
}

class UnsupportedResponseTypeError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "unsupported_response_type";
    }
}

class UnsupportedGrantTypeError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "unsupported_grant_type";
    }
}

class UnauthorizedRequestError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 401;
        this.head.msg = "unsupported_request";
    }
}

class UnauthorizedClientError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 400;
        this.head.msg = "unsupported_client";
    }
}

class ServerError extends DefaultError {
    constructor(reason) {
        super(reason);
        this.head.code = 503;
        this.head.msg = "server_error";
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
class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
        this.metadata = null;
    }
}

class SuccessModel extends BaseModel {
    constructor(data, metadata, message) {
        super(data, message, metadata)
        this.errno = 0
        if (metadata) {
            this.metadata = metadata;
        }
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
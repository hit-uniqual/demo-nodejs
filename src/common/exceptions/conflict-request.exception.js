const { HTTP_CONFLICT } = require('../../../constants')
const GeneralError = require('./general-error')

class ConflictException extends GeneralError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_CONFLICT
  }
}

export default ConflictException

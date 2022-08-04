require('dotenv').config()

module.exports = {
  /**
   * App port
   */
  serverPort: process.env.PORT || 3000,
  /**
   * App base url
   * @param {string} path
   */
  baseUrl(path = null) {
    const host = process.env.APP_URL
    const url = `${host}:${this.serverPort}`

    return url + (path ? `/${path}` : '')
  },
  /**
   * Api base url
   * @param {string} path
   */
  apiBaseUrl(path = null) {
    const url = `${this.baseUrl()}/api/v1`
    return url + (path ? `/${path}` : '')
  },
}

module.exports.HTTP_INTERNAL_SERVER = 500
module.exports.HTTP_UNPROCESSABLE = 422
module.exports.HTTP_CONFLICT = 409
module.exports.HTTP_NOT_FOUND = 404
module.exports.HTTP_FORBIDDEN = 403
module.exports.HTTP_UNAUTHORIZE = 401
module.exports.HTTP_BAD_REQUEST = 400
module.exports.SOCIAL_PROVIDERS = {
  GOOGLE: 'google',
  APPLE: 'apple',
}

module.exports.APP_KEY = process.env.APP_KEY

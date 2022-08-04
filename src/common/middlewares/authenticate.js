import passport from 'passport'
import UnauthorizeException from '../exceptions/unauthorize.exception'

export default (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      return next(new UnauthorizeException((info && info.message) || err))
    }

    req.user = user
    return next()
  })(req, res, next)
}

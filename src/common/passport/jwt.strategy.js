import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import moment from 'moment'
import knex from '../config/database.config'
import { APP_KEY as JWT_SECRET } from '../../../constants'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      if (moment.utc().unix() > jwtPayload.exp) {
        return done(null, false)
      }

      const checkToken = await knex('access_tokens')
        .where('access_tokens.id', jwtPayload.jti)
        .where({
          userId: jwtPayload.sub,
          revoked: false,
        })
        .innerJoin('users', 'access_tokens.userId', '=', 'users.id')
        .first()

      if (
        !checkToken ||
        moment.utc().unix() > moment.unix(checkToken.expiresAt)
      ) {
        return done(null, false)
      }

      const user = await knex('users')
        .where({
          id: jwtPayload.sub,
        })
        .first()

      if (!user) {
        return done(null, false)
      }

      delete user.password
      user.jti = jwtPayload.jti
      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  })
)

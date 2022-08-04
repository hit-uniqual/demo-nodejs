import { Router } from 'express'
import authenticateUser from '../common/middlewares/authenticate'
import usersRouter from '../users/users.route'
import authRouter from '../auth/auth.route'
import forgotPasswordRouter from '../forgot-password/forgot-password.route'

const router = Router()

router.use('/auth', authRouter)
router.use('/users', authenticateUser, usersRouter)
router.use('/forgot-password', forgotPasswordRouter)

export default router

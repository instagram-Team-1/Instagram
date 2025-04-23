import express from "express"
import { createAccount } from "../resolvers/auth/create-account.js"
import { loginAccount } from "../resolvers/auth/login-account.js"

const router = express.Router()

router.post('/register', createAccount)
router.post('/login', loginAccount)

export default router
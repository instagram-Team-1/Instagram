
import express from 'express';
import createAccount from '../utils/auth/create-account';
import loginAccount from '../utils/auth/login-account';
const router = express.Router();

router.post('/register', createAccount); 
router.post('/login', loginAccount)

export default router;

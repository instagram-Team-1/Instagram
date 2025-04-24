
import express from 'express';
import createAccount from '../utils/auth/create-account';
import loginAccount from '../utils/auth/login-account';
import getMe from '../utils/auth/GetMe';
const router = express.Router();

router.post('/register', createAccount); 
router.post('/login', loginAccount)
router.get("/me", getMe); 

export default router;

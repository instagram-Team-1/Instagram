
import express from 'express';
import preCheck from '../utils/auth/preCheck';
import loginAccount from '../utils/auth/login-account';
import createAccount from '../utils/auth/create-account';
const router = express.Router();


router.post('/register', preCheck); 
router.post('/login', loginAccount)
router.post('/create-account', createAccount )





export default router;

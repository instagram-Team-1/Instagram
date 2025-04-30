
import express from 'express';
import preCheck from '../utils/auth/preCheck';
import loginAccount from '../utils/auth/login-account';
import createAccount from '../utils/auth/create-account';
import searchUser from '../utils/auth/searchUser'
const router = express.Router();


router.post('/register', preCheck); 
router.post('/login', loginAccount)
router.post('/create-account', createAccount )
router.get('/messages/:name', searchUser)





export default router;

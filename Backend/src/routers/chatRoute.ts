import express from 'express'
import getGroup from '../controller/Chat/getGroup'
import changeName from '../controller/Chat/changeName'
import addMember from '../controller/Chat/addMember'
import searcher from '../controller/Chat/searcher'
import checker from '../controller/Chat/checker'
const router = express.Router()
router.patch('/name/:roomId', changeName)
router.get('/get/:roomId',getGroup)
router.patch('/add/:roomId', addMember)
router.post('/users/:roomId',searcher)
router.post('/checkRoom', checker)

export default router;
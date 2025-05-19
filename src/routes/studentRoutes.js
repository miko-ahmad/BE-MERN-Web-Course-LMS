import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { deleteStudent, getStudent, getStudentById, postStudent, updateStudent } from '../controllers/studentController.js'
import multer from 'multer'
import { fileFilter, fileStorage } from '../utils/multer.js'

const studentRoutes = express.Router()

const upload = multer({
    storage: fileStorage('students'),
    fileFilter
})

studentRoutes.get('/students', verifyToken, getStudent)
studentRoutes.get('/students/:id', verifyToken, getStudentById)

studentRoutes.post('/students', verifyToken, upload.single('photo'), postStudent)
 
studentRoutes.put('/students/:id', verifyToken, upload.single('photo'), updateStudent)
studentRoutes.delete('/students/:id', verifyToken, deleteStudent )

export default studentRoutes 
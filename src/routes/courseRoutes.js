import express from 'express'
import multer from 'multer'
import { getCourses } from '../controllers/courseController.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { fileFilter, fileStorageCourse } from '../utils/multer.js'

const courseRoutes = express.Router()

const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

courseRoutes.get('/courses', verifyToken, getCourses)
courseRoutes.post('/courses', verifyToken, upload.single('thumbnail'), getCourses)
export default courseRoutes
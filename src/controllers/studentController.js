import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import { mutateStudentSchema } from '../utils/schema.js'
import courseModel from '../models/courseModel.js'
import path from 'path'
import fs from 'fs'

export const getStudent = async (req, res) => {
    try {
        const student = await userModel.find({
            role: 'student',
            manager: req.user._id
        }).select('name courses photo')

        const photoUrl = process.env.APP_URL + '/uploads/students/'

        const response = student.map((item) => {
            return {
                ...item.toObject(),
                photo_url: photoUrl + item.photo
            }
        })

        return res.json({
            message: 'Get student Success',
            data: response,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server Error'
        }) 
    }
}

export const getStudentById = async (req, res) => {
    try {
        const {id} = req.params

        const student = await userModel.findById(id).select('name email')

        return res.json({
            message: 'Get detail student success',
            data: student
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server Error'
        }) 
    }
}

export const postStudent = async (req,res) => {
    try {
        const body = req.body;
        
            const parse = mutateStudentSchema.safeParse(body);
            
            if (!parse.success) {
              const errorMessages = parse.error.issues.map((err) => err.message);
              if (req?.file?.path && fs.existsSync(req?.file?.path)) {
                fs.unlinkSync(req?.file?.path);
              }
              return res.status(500).json({
                message: "Error Validation",
                data: null,
                errors: errorMessages,
              });
            }

            const hashPassword = bcrypt.hashSync(body.password, 12)

            const student = new userModel({
                name: parse.data.name,
                email: parse.data.email,
                password: hashPassword,
                photo: req.file?.filename,
                manager: req.user?._id ,
                role: 'student' 
            })

            await student.save()

            return res.json({
                message: 'create student success'
            })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server Error'
        }) 
    }
}

export const updateStudent = async (req,res) => {
    try {
        const {id} = req.params
        const body = req.body;
        
            const parse = mutateStudentSchema.partial({
                password: true
            }).safeParse(body);

            if (!parse.success) {
              const errorMessages = parse.error.issues.map((err) => err.message);
              if (req?.file?.path && fs.existsSync(req?.file?.path)) {
                fs.unlinkSync(req?.file?.path);
              }
              return res.status(500).json({
                message: "Error Validation",
                data: null,
                errors: errorMessages,
              });
            }

            const student = await userModel.findById(id)

            const hashPassword = parse.data?.password ? bcrypt.hashSync(parse.data.password, 12) : student.password

            await userModel.findByIdAndUpdate(id, {
                name: parse.data.name,
                email: parse.data.email,
                password: hashPassword,
                photo: req?.file ? req.file?.filename : student.photo,
               
               
            })

            return res.json({
                message: 'Update student success'
            })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server Error'
        }) 
    }
}

export const deleteStudent = async (req,res) => {
    try {
        const {id} = req.params

        const student = await userModel.findById(id)

        await courseModel.findOneAndUpdate({
            students: id,
        }, {
            $pull: {
                students: id
            }
        })

         const dirname = path.resolve();
        
            const filePath = path.join(
              dirname,
              "public/uploads/students",
              student.photo
            );
        
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }

        await userModel.findOneAndDelete(id)

        return res.json({
            message: 'Delete student success'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server Error'
        }) 
    }
}

export const getCoursesStudent = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate({
            path: 'courses',
            select: 'name category thumbnail',
            populate: {
                path: 'category',
                select: 'name'
            }
        })

        const imageUrl = process.env.APP_URL + '/uploads/courses/'

        const response = user?.courses?.map((item) => {
            return {
                ...item.toObject(),
                thumbnail_url: imageUrl + item.thumbnail,
                // total_students: item.students.length
            }
        })

        return res.json({
            message: 'Get Courses success',
            data: response
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server Error'
        }) 
    }
}
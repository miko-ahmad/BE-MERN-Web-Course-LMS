import { z } from "zod";

export const exampleSchema = z.object({
    name: z.string().min(3)
})

export const signUpSchema = z.object({
    name: z.string().min(5),
    email: z.string().email(5),
    password: z.string().min(5),
})

export const signInSchema = signUpSchema.omit({name:true})


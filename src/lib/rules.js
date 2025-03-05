import {string, z} from "zod";

export const LoginFormSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email.'}).trim(),
    password: z.string().min(1, {message: "password is required"}).trim(),
})

export const RegisterFormSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email.'}).trim(),
    password: z
        .string()
        .min(1, {message: "Not be empty"})
        .min(5, {message: "Be at least 5 characters long"})
        .regex(/[a-zA-Z]/, {message: "Contain at least one letter."})
        .regex(/[0-9]/, {message: "Contain at least one number."})
        .regex(/[^a-zA-Z0-9]/, {
            message: "Contain at least one special character.",
        })
        .trim(),
    confirmPassword: z.string().trim(),
}).superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"],
        })
    }
})


export const MemberSchema = z.object({
    name: string()
        .min(1, {message: "Name filed is required."})
        .max(100,{message: "Name Cant' be more than 100 characters."})
        .trim(),

    address: string()
        .min(1, {message: "Address filed is required."})
        .trim(),
})

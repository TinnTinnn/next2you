import {z} from "zod";

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


export const JobSchema = z.object({
    title: z.string()
        .min(1, {message: "Title field is required."})
        .max(100, {message: "Title can't be more than 100 characters."})
        .trim(),

    position: z.string()
        .min(1, {message: "position filed is required."})
        .trim(),

    customPosition: z
        .string()
        .max(20, {message: "Custom position can't exceed 20 characters."})
        .optional()
        .or(z.literal("")),  // กรณีไม่ได้ระบุไว้

    gender: z
        .enum(["Male", "Female", "Unspecified"])
        .optional(), // กรณีเฉพาะตอนเลือก Position เป็น Singer

    genre: z
        .string()
        .min(1, {message: "Genre is required."})
        .max(50)
        .trim(),

    date: z
        .string()
        .min(1, {message: "Date is required."}),

    startTime: z
        .string()
        .min(1, {message: "Start time is required."}),

    endTime: z
        .string()
        .min(1, { message: "End time is required."}),

    hasBreak: z
        .boolean()
        .optional(),

    breakCount:z
        .number()
        .min(0)
        .optional(),

    breakDuration: z
        .number()
        .min(0)
        .optional(),

    rate: z
        .number()
        .min(0, {message: "Rate must be at least 0."}),

    place: z
        .string()
        .min(1, {message: "Venue name is required."}),

    location: z
        .string()
        .url({message: "Location must be a valid URL."})
        .optional(),

    welfare: z
        .string()
        .max(500)
        .optional(),
})

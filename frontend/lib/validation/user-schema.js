import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email format").trim().max(200, "Email must be less then 200 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(200, "Password must be less then 200 characters")
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(4, "Name must be at least 4 characters").max(200, "Name must be less then 200 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters").max(200, "Password must be less then 200 characters")
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
});
import { z } from "zod";

export const resetPasswordSchema = new z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(200, "Password must be less then 200 characters"),
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
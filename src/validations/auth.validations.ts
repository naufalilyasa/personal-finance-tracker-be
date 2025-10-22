import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .min(1, { error: "Email is required" }),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export const loginPayloadTokenSchema = z.object({
  name: z.string(),
  email: z.email(),
});

export const registerSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: z
    .email("Email must be a valid email address")
    .min(1, { error: "Email is required" }),

  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;

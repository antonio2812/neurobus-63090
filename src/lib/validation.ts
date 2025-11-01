import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido. Use o formato nome@dominio.com" }),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});

export const signupSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  email: z.string().email({ message: "Email inválido. Use o formato nome@dominio.com" }),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
  confirmPassword: z.string().min(8, { message: "A confirmação de senha deve ter no mínimo 8 caracteres." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido. Use o formato nome@dominio.com" }),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, { message: "A nova senha deve ter no mínimo 8 caracteres." }),
  confirmPassword: z.string().min(8, { message: "A confirmação de senha deve ter no mínimo 8 caracteres." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});
import { z } from "zod";

// Mensagem estática solicitada
const STATIC_PASSWORD_MESSAGE = "Só isso? Capricha mais! Use pelo menos 8 caracteres.";

// Esquema de Login (Sem validação de min length na senha, conforme solicitado no ponto 2.1)
export const loginSchema = z.object({
  email: z.string().email({ message: "Esse email não é válido. Use o formato nome@dominio.com" }),
  // A validação de senha mínima é removida aqui, o erro virá do Supabase se for inválida.
  password: z.string(), 
});

export const signupSchema = z.object({
  name: z.string().min(1, { message: "Não tá esquecendo nada? Preenche esse campo aí rapidinho." }),
  email: z.string().email({ message: "Esse email não é válido. Use o formato nome@dominio.com" }),
  password: z.string().min(8, STATIC_PASSWORD_MESSAGE),
  confirmPassword: z.string().min(8, STATIC_PASSWORD_MESSAGE),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Ops! As senhas não estão batendo.",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Esse email não é válido. Use o formato nome@dominio.com" }),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, STATIC_PASSWORD_MESSAGE),
  confirmPassword: z.string().min(8, STATIC_PASSWORD_MESSAGE),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Ops! As senhas não estão batendo.",
  path: ["confirmNewPassword"],
});
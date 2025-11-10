import { z } from "zod";

// Função customizada para gerar a mensagem de erro de senha com contagem de caracteres
const passwordMinLengthMessage = (min: number) => ({
  message: () => {
    // Mensagem estática solicitada
    return `Só isso? Capricha mais! Use pelo menos 8 caracteres.`;
  },
});

// Esquema de Login (Sem validação de min length na senha, conforme solicitado no ponto 2.1)
export const loginSchema = z.object({
  email: z.string().email({ message: "Esse email não é válido. Use o formato nome@dominio.com" }),
  // A validação de senha mínima é removida aqui, o erro virá do Supabase se for inválida.
  password: z.string(), 
});

export const signupSchema = z.object({
  name: z.string().min(1, { message: "Não tá esquecendo nada? Preenche esse campo aí rapidinho." }),
  email: z.string().email({ message: "Esse email não é válido. Use o formato nome@dominio.com" }),
  password: z.string().min(8, passwordMinLengthMessage(8)),
  confirmPassword: z.string().min(8, passwordMinLengthMessage(8)),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Ops! As senhas não estão batendo.",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Esse email não é válido. Use o formato nome@dominio.com" }),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, passwordMinLengthMessage(8)),
  confirmPassword: z.string().min(8, passwordMinLengthMessage(8)),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Ops! As senhas não estão batendo.",
  path: ["confirmNewPassword"],
});
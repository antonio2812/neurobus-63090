import { z } from "zod";

// Função customizada para gerar a mensagem de erro de senha com contagem de caracteres
const passwordMinLengthMessage = (min: number) => ({
  message: (ctx: z.RefinementCtx) => {
    const currentLength = String(ctx.data).length;
    return `Só isso? Capricha mais! Use pelo menos ${min} caracteres. Você usou (${currentLength}).`;
  },
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Esse email não é válido. Use o formato nome@dominio.com" }),
  password: z.string().min(8, passwordMinLengthMessage(8)),
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
  path: ["confirmPassword"],
});
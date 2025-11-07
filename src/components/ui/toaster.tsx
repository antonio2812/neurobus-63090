"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      {/* 
        Ajuste de Viewport:
        - Padrão (Desktop): bottom-right, max-w-[420px]
        - Mobile (max-w-sm): bottom-0, full width, padding horizontal e maior padding inferior
      */}
      <ToastViewport className="
        fixed bottom-0 right-0 flex flex-col-reverse p-4 z-[100]
        sm:bottom-4 sm:right-4 sm:top-auto sm:max-w-[420px] 
        
        /* Mobile adjustments (<= 640px) */
        max-sm:w-full max-sm:items-start max-sm:p-4 max-sm:pb-12
      " />
    </ToastProvider>
  )
}
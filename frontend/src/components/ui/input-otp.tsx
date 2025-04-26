"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number
}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ className, maxLength = 1, ...props }, ref) => {
    return (
      <input
        ref={ref}
        maxLength={maxLength}
        className={cn(
          "w-10 h-10 text-center border border-input bg-background text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("flex items-center gap-2", className)} {...props} />
}
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = ({ index, ...props }: { index: number } & React.InputHTMLAttributes<HTMLInputElement>) => {
  return <InputOTP {...props} />
}
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }

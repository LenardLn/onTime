import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  errorText?: string;
}

export const InputTypes = {
  TEXT: "text",
  PASSWORD: "password",
  EMAIL: "email",
  NUMBER: "number",
} as const;

function Input({ className, type, label, errorText, ...props }: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-16 text-2xl w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 shadow-xs outline-none placeholder:text-muted-foreground",
          errorText && "border-destructive ring-destructive/50",
          className,
        )}
        {...props}
      />
      {errorText && <p className="text-destructive">{errorText}</p>}
    </div>
  );
}

export { Input };

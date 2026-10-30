import type { InputHTMLAttributes } from "react";
import type { UseFormRegister } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<any>;
  error?: string;
  name: string;
}

export default function Input({
  placeholder,
  type,
  className = "",
  register,
  error,
  name,
  ...rest
}: InputProps) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        id={name}
        className={`h-11 border-2 rounded-lg border-gray-500 px-2.5 outline-none text-base w-full ${className}`}
        {...register(name)}
        {...rest}
      />
      {error && <span className="text-red-600">{error}</span>}
    </>
  );
}

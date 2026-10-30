import { type ReactNode, type ButtonHTMLAttributes } from "react";

const DesignColors = {
  green: "bg-green-600",
  black: "bg-black",
} as const;

type DesignColorsType = keyof typeof DesignColors;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  bgColor: DesignColorsType;
}

export default function Button({
  bgColor,
  type = "button",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`h-12 text-white  font-bold rounded-lg cursor-pointer text-lg w-full flex justify-center items-center gap-2 ${DesignColors[bgColor]} ${className}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}

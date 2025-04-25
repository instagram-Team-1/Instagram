import React from "react"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
}) => {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value
    if (/^\d?$/.test(val)) {
      const nextValue = value.split("")
      nextValue[index] = val
      onChange(nextValue.join(""))

      if (val && index < length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const prevInput = inputsRef.current[index - 1]
      prevInput?.focus()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-10 h-12 rounded-md border border-input bg-background text-center text-xl font-medium outline-none transition ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      ))}
    </div>
  )
}

import { useRef, useState } from "react";

export default function OTPCodeInput({onChange, onComplete}) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  function handleCodeChange(index, value) {
      const newCode = [...code];
      if (value.length > 1) {
        const pastedCode = value.slice(0, 6 - index).split(""); // fit remaining slots
        for (let i = 0; i < pastedCode.length; i++) {
          if (!/^\d*$/.test(pastedCode[i])) return; // only allow digits
          newCode[index + i] = pastedCode[i];
        }
        setCode(newCode);
        onChange?.(newCode.join(''));
        const nextEmpty = newCode.findIndex((d) => d === "");
        const focusIndex = nextEmpty === -1 ? 5 : nextEmpty; // it will be -1 if all slots are filled
        inputRefs.current[focusIndex]?.focus();
        if (newCode.every((c) => c !== "")) {
          onComplete?.(code);
        }
        return;
      }

      if (!/^\d*$/.test(value)) return; // only allow digits
      newCode[index] = value;
      setCode(newCode);
      onChange?.(newCode.join(''));
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      if (newCode.every((c) => c !== "")) {
        onComplete?.(code);
      }
    }
  
    function handleKeyDown(index, e) {
      console.log("keydown index:", index, "value:", code[index]);
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="6"
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-14 w-12 rounded-lg border-2 border-border/40 bg-input/60 backdrop-blur text-center text-2xl font-bold text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-input/80"
          />
        ))}
      </div>
    </div>
  );
}
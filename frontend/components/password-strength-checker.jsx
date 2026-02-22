import { Check, X } from "lucide-react";
import passwordCriteria from "../lib/utils/password-criteria";

export default function PasswordStrengthChecker({ password = "" }) {
  const criteria = passwordCriteria(password);
  const metCount = criteria.filter((item) => item.met).length;
  let criterionStatus;
  let criterionColor;
  if (!password) {
    criterionStatus = "Enter password";
    criterionColor = "bg-muted-foreground";
  } else {
    switch (metCount) {
      case 1:
        criterionStatus = "weak";
        criterionColor = "bg-red-500";
        break;

      case 2:
        criterionStatus = "fair";
        criterionColor = "bg-orange-500";
        break;

      case 3:
        criterionStatus = "good";
        criterionColor = "bg-yellow-500";
        break;

      case 4:
        criterionStatus = "strong";
        criterionColor = "bg-lime-500";
        break;

      case 5:
        criterionStatus = "very strong";
        criterionColor = "bg-green-500";
        break;

      default:
        criterionStatus = "weak";
        criterionColor = "bg-red-500";
    }
  }

  return (
    <div className="mt-2 space-y-3">
      <div className="space-y-1.5">
        <div className="text-muted-foreground text-xs font-medium flex items-center justify-between">
          <span>Password Strength</span>
          <span>{criterionStatus}</span>
        </div>
        <div className={`grid grid-cols-5 gap-1.5`}>
          {Array.from({ length: 5}).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-lg ${index < metCount ? criterionColor : "bg-muted-foreground"}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center text-xs">
            {criterion.met ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <X className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            <span
              className={`${criterion.met ? "text-green-500" : "text-muted-foreground"} `}
            >
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

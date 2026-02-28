import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';

export function FeedbackAlert({ type, message }) {
  const variants = {
    error: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      text: 'text-destructive',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: CheckCircle,
    },
    info: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      text: 'text-primary',
      icon: InfoIcon,
    },
  };

  const variant = variants[type];
  const IconComponent = variant.icon;

  return (
    <div className={`rounded-lg border ${variant.bg} ${variant.border} px-4 py-3 flex items-center gap-3`}>
      <IconComponent className={`h-5 w-5 ${variant.text} shrink-0`} />
      <p className={`text-sm ${variant.text}`}>{message}</p>
    </div>
  );
}

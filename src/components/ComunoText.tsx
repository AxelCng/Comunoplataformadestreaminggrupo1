interface ComunoTextProps {
  className?: string;
}

export function ComunoText({ className = "" }: ComunoTextProps) {
  return (
    <div className={`${className}`}>
      COMUNO
    </div>
  );
}

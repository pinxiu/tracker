interface Props {
  value: number;
  label?: string;
}

export default function ProgressBar({ value, label }: Props) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="progress">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
      <span className="progress-value">{safeValue}%</span>
    </div>
  );
}

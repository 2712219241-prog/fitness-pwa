interface IconTileProps {
  label: string;
  shortLabel: string;
  onClick?: () => void;
}

export function IconTile({ label, shortLabel, onClick }: IconTileProps) {
  return (
    <button className="icon-tile" type="button" onClick={onClick} aria-label={label}>
      <span className="tile-illustration">{shortLabel}</span>
      <strong>{label}</strong>
    </button>
  );
}

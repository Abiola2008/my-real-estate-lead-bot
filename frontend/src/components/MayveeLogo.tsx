type MayveeLogoProps = {
  showText?: boolean;
  small?: boolean;
};

export default function MayveeLogo({
  showText = true,
  small = false,
}: MayveeLogoProps) {
  return (
    <div className={`mayvee-logo ${small ? "small" : ""}`}>
      <div className="mayvee-logo-icon" aria-hidden="true">
        <svg
          viewBox="0 0 120 120"
          className="mayvee-logo-svg"
          role="img"
        >
          {/* House roof */}
          <path
            d="M22 50 L60 20 L98 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mayvee-logo-roof"
          />

          {/* House body */}
          <path
            d="M30 48 V92 C30 97 34 100 39 100 H81 C86 100 90 97 90 92 V48"
            fill="currentColor"
            className="mayvee-logo-body"
          />

          {/* Door accent */}
          <rect
            x="54"
            y="74"
            width="12"
            height="26"
            rx="3"
            className="mayvee-logo-door"
          />

          {/* MV text */}
          <text
            x="60"
            y="70"
            textAnchor="middle"
            className="mayvee-logo-textmark"
          >
            MV
          </text>
        </svg>
      </div>

      {showText && (
        <div className="mayvee-logo-wordmark">
          <strong>MAYVEE</strong>
          <span>Homes & Properties</span>
        </div>
      )}
    </div>
  );
}
export const LighthouseSvg = ({ size = 24, color = 'currentColor', ...rest }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width={(2 / 3) * size} height={size} {...rest}>
      <path d="M 65 280 L 135 280 L 130 240 L 70 240 Z" fill="#000" />

      <path d="M 70 240 L 75 140 L 125 140 L 130 240 Z" fill={color} stroke="#000" strokeWidth="2" />

      <defs>
        <clipPath id="tower-clip">
          <path d="M 70 240 L 75 140 L 125 140 L 130 240 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#tower-clip)">
        <rect x="65" y="220" width="70" height="25" fill="#000" transform="rotate(-8 100 232)" />
        <rect x="65" y="180" width="70" height="25" fill="#000" transform="rotate(-8 100 192)" />
      </g>

      <rect x="68" y="125" width="64" height="15" fill={color} stroke="#000" strokeWidth="2" />

      <path d="M 73 125 L 100 105 L 127 125 Z" fill="#000" />
    </svg>
  );
};

export default function CardImage({ card }) {
  const COLORS = ['red', 'green', 'blue'];

  return (
    <>
      <svg>
        <defs>
          <pattern
            id="stripe"
            patternUnits="userSpaceOnUse"
            width="6.5"
            height="6.5"
            patternTransform="rotate(90)"
          >
            <line
              x1="0"
              y="0"
              x2="0"
              y2="6.5"
              stroke="black"
              stroke-width="5"
            />
          </pattern>
        </defs>
      </svg>

      <svg>
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M50,0L0,75l50,75l50-75L50,0Z"
          transform="matrix(.742307 0 0 0.742307 12.88465 19.326975)"
          fill="url(#stripe)"
          stroke="#000"
          stroke-width="5"
        />
      </svg>
      <svg>
        <ellipse
          xmlns="http://www.w3.org/2000/svg"
          rx="35"
          ry="55"
          transform="translate(50 75)"
          fill="url(#stripe)"
          stroke="#000"
          stroke-width="5"
        />
      </svg>
    </>
  );
}

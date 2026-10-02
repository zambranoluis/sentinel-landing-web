// Geometry exported from the supplied references/sections/2-how-it-works/cube-radiant.html.
import styles from "./CubeMotion.module.css";

export function CubeArtwork() {
  return (
    <svg
      viewBox="210 75 480 530"
      aria-hidden="true"
      focusable="false"
      className={styles.artwork}
    >
      <defs>
        <linearGradient id="how-leftFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#04131e" stopOpacity=".60"></stop>
          <stop offset="1" stopColor="#1187bd" stopOpacity=".12"></stop>
        </linearGradient>

        <linearGradient id="how-rightFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1396cb" stopOpacity=".10"></stop>
          <stop offset="1" stopColor="#021019" stopOpacity=".62"></stop>
        </linearGradient>

        <radialGradient id="how-coreGlow">
          <stop offset="0" stopColor="#ebffff" stopOpacity="1"></stop>
          <stop offset=".16" stopColor="#88f3ff" stopOpacity=".94"></stop>
          <stop offset=".42" stopColor="#14c1f7" stopOpacity=".34"></stop>
          <stop offset="1" stopColor="#14c1f7" stopOpacity="0"></stop>
        </radialGradient>

        <filter
          id="how-softGlow"
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur stdDeviation="3.4" result="blur"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blur"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>

        <filter
          id="how-nodeGlow"
          x="-180%"
          y="-180%"
          width="460%"
          height="460%"
        >
          <feGaussianBlur stdDeviation="3.2" result="blur"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blur"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>

        <filter id="how-bigGlow" x="-180%" y="-180%" width="460%" height="460%">
          <feGaussianBlur stdDeviation="16"></feGaussianBlur>
        </filter>

        <clipPath id="how-clip-left">
          <path
            id="how-clipLeftPath"
            d="M295.85 247.00 L450.00 336.00 L450.00 514.00 L295.85 425.00 Z"
          ></path>
        </clipPath>
        <clipPath id="how-clip-right">
          <path
            id="how-clipRightPath"
            d="M450.00 336.00 L604.15 247.00 L604.15 425.00 L450.00 514.00 Z"
          ></path>
        </clipPath>
      </defs>

      <g id="how-ambient">
        <ellipse
          cx="450"
          cy="502"
          rx="180"
          ry="85"
          className={styles["core"]}
        ></ellipse>
        <circle cx="450" cy="110" r="2.5" className={styles["spark"]}></circle>
        <circle cx="428" cy="143" r="1.7" className={styles["spark"]}></circle>
        <circle cx="474" cy="162" r="1.7" className={styles["spark"]}></circle>
        <circle cx="340" cy="176" r="1.5" className={styles["spark"]}></circle>
        <circle cx="566" cy="194" r="1.6" className={styles["spark"]}></circle>
        <circle cx="274" cy="236" r="1.5" className={styles["spark"]}></circle>
        <circle cx="628" cy="276" r="1.5" className={styles["spark"]}></circle>
        <circle cx="296" cy="454" r="1.4" className={styles["spark"]}></circle>
        <circle cx="604" cy="432" r="1.6" className={styles["spark"]}></circle>
      </g>
      <g className={styles["cube-wrap"]} id="how-cubeWrap">
        <polygon
          points="450.00,158.00 604.15,247.00 450.00,336.00 295.85,247.00"
          className={styles["face-top"]}
        ></polygon>
        <polygon
          points="295.85,247.00 450.00,336.00 450.00,514.00 295.85,425.00"
          className={styles["face-left"]}
        ></polygon>
        <polygon
          points="450.00,336.00 604.15,247.00 604.15,425.00 450.00,514.00"
          className={styles["face-right"]}
        ></polygon>
        <path
          d="M450.00 158.00 L604.15 247.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M604.15 247.00 L450.00 336.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M450.00 336.00 L295.85 247.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M295.85 247.00 L450.00 158.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M295.85 247.00 L295.85 425.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M450.00 336.00 L450.00 514.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M604.15 247.00 L604.15 425.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M295.85 425.00 L450.00 514.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M450.00 514.00 L604.15 425.00"
          className={styles["line-main"]}
        ></path>
        <path
          d="M295.85 247.00 L450.00 336.00"
          className={styles["glow-line"]}
        ></path>
        <path
          d="M450.00 336.00 L604.15 247.00"
          className={styles["glow-line"]}
        ></path>
        <path
          d="M295.85 247.00 L295.85 425.00"
          className={styles["glow-line"]}
        ></path>
        <path
          d="M450.00 336.00 L450.00 514.00"
          className={styles["glow-line"]}
        ></path>
        <path
          d="M604.15 247.00 L604.15 425.00"
          className={styles["glow-line"]}
        ></path>
        <path
          d="M295.85 425.00 L450.00 514.00"
          className={styles["glow-line"]}
        ></path>
        <path
          d="M450.00 514.00 L604.15 425.00"
          className={styles["glow-line"]}
        ></path>
        <path
          d="M398.62 187.67 L552.77 276.67"
          className={styles["line-soft"]}
        ></path>
        <path
          d="M501.38 187.67 L347.23 276.67"
          className={styles["line-soft"]}
        ></path>
        <path
          d="M347.23 217.33 L501.38 306.33"
          className={styles["line-soft"]}
        ></path>
        <path
          d="M552.77 217.33 L398.62 306.33"
          className={styles["line-soft"]}
        ></path>
        <path
          d="M295.85 306.33 L450.00 395.33"
          className={styles["line-side"]}
        ></path>
        <path
          d="M295.85 365.67 L450.00 454.67"
          className={styles["line-side"]}
        ></path>
        <path
          d="M450.00 395.33 L604.15 306.33"
          className={styles["line-side"]}
        ></path>
        <path
          d="M450.00 454.67 L604.15 365.67"
          className={styles["line-side"]}
        ></path>
        <path
          d="M347.23 276.67 L347.23 454.67"
          className={styles["line-soft"]}
        ></path>
        <path
          d="M398.62 306.33 L398.62 484.33"
          className={styles["line-soft"]}
        ></path>
        <path
          d="M501.38 306.33 L501.38 484.33"
          className={styles["line-soft"]}
        ></path>
        <path
          d="M552.77 276.67 L552.77 454.67"
          className={styles["line-soft"]}
        ></path>
        <path
          d="M450 158 L604.1525218736301 247 L450 336 L295.8474781263699 247 Z"
          className={styles["pulse"]}
          style={{ animationDelay: "0s", strokeWidth: "1.5" }}
        ></path>
        <path
          d="M398.62 187.67 L552.77 276.67"
          className={styles["pulse"]}
          style={{ animationDelay: "0.14s", strokeWidth: "1.45" }}
        ></path>
        <path
          d="M501.38 187.67 L347.23 276.67"
          className={styles["pulse"]}
          style={{ animationDelay: "0.22s", strokeWidth: "1.45" }}
        ></path>
        <path
          d="M347.23 217.33 L501.38 306.33"
          className={styles["pulse"]}
          style={{ animationDelay: "0.28s", strokeWidth: "1.45" }}
        ></path>
        <path
          d="M552.77 217.33 L398.62 306.33"
          className={styles["pulse"]}
          style={{ animationDelay: "0.36s", strokeWidth: "1.45" }}
        ></path>
        <path
          d="M295.85 306.33 L450.00 395.33"
          className={styles["pulse"]}
          style={{ animationDelay: "0.48s" }}
        ></path>
        <path
          d="M450.00 395.33 L604.15 306.33"
          className={styles["pulse"]}
          style={{ animationDelay: "0.48s" }}
        ></path>
        <path
          d="M295.85 365.67 L450.00 454.67"
          className={styles["pulse"]}
          style={{ animationDelay: "0.7s" }}
        ></path>
        <path
          d="M450.00 454.67 L604.15 365.67"
          className={styles["pulse"]}
          style={{ animationDelay: "0.7s" }}
        ></path>
        <path
          d="M450.00 158.00 L450.00 514.00"
          className={styles["pulse"]}
          style={{ animationDelay: ".26s", strokeWidth: "1.55" }}
        ></path>
        <path
          d="M295.8474781263699 425 L450 514 L604.1525218736301 425 L604.1525218736301 443 L450 532 L295.8474781263699 443 Z"
          className={styles["line-soft"]}
        ></path>
        <circle
          cx="450"
          cy="336"
          r="2.8"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0s" }}
        ></circle>
        <circle
          cx="450"
          cy="395.3333333333333"
          r="2.8"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.12s" }}
        ></circle>
        <circle
          cx="450"
          cy="454.66666666666663"
          r="2.8"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.24s" }}
        ></circle>
        <circle
          cx="450"
          cy="514"
          r="2.8"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.36s" }}
        ></circle>
        <circle
          cx="295.8474781263699"
          cy="306.3333333333333"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.48s" }}
        ></circle>
        <circle
          cx="295.8474781263699"
          cy="365.66666666666663"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0s" }}
        ></circle>
        <circle
          cx="604.1525218736301"
          cy="306.3333333333333"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.12s" }}
        ></circle>
        <circle
          cx="604.1525218736301"
          cy="365.66666666666663"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.24s" }}
        ></circle>
        <circle
          cx="347.2316520842466"
          cy="336"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.36s" }}
        ></circle>
        <circle
          cx="501.3841739578767"
          cy="365.66666666666663"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.48s" }}
        ></circle>
        <circle
          cx="398.6158260421233"
          cy="365.66666666666663"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0s" }}
        ></circle>
        <circle
          cx="552.7683479157535"
          cy="336"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.12s" }}
        ></circle>
        <circle
          cx="347.2316520842466"
          cy="395.3333333333333"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.24s" }}
        ></circle>
        <circle
          cx="501.3841739578767"
          cy="424.99999999999994"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.36s" }}
        ></circle>
        <circle
          cx="398.6158260421233"
          cy="424.99999999999994"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0.48s" }}
        ></circle>
        <circle
          cx="552.7683479157535"
          cy="395.3333333333333"
          r="2.1"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: "0s" }}
        ></circle>
        <circle cx="450" cy="400.08" r="36" className={styles["core"]}></circle>
        <circle
          cx="450"
          cy="400.08"
          r="3"
          className={styles["node"] + " " + styles["pulse-node"]}
          style={{ animationDelay: ".12s" }}
        ></circle>
        <g clipPath="url(#how-clip-left)">
          <path
            d="M319.8474781263699 293 h14 m6 0 h10"
            className={styles["micro"]}
          ></path>
          <path
            d="M325.8474781263699 309 h22 m6 0 h14"
            className={styles["micro"]}
          ></path>
          <path
            d="M330.8474781263699 369 h16 m6 0 h9"
            className={styles["micro"]}
          ></path>
          <path
            d="M339.8474781263699 388 h24 m6 0 h12"
            className={styles["micro"]}
          ></path>
          <path
            d="M327.8474781263699 469 h16 m6 0 h8"
            className={styles["micro"]}
          ></path>
          <path
            d="M342.8474781263699 488 h24 m6 0 h12"
            className={styles["micro"]}
          ></path>
        </g>
        <g clipPath="url(#how-clip-right)">
          <path d="M486 305 h16 m6 0 h10" className={styles["micro"]}></path>
          <path d="M495 323 h22 m6 0 h14" className={styles["micro"]}></path>
          <path d="M484 387 h16 m6 0 h9" className={styles["micro"]}></path>
          <path d="M498 405 h24 m6 0 h12" className={styles["micro"]}></path>
          <path d="M486 483 h16 m6 0 h8" className={styles["micro"]}></path>
          <path d="M500 502 h24 m6 0 h12" className={styles["micro"]}></path>
        </g>
      </g>
    </svg>
  );
}

import Image from "next/image";
import { AssessmentAction } from "./AssessmentAction";
import styles from "./Hero.module.css";

function DetectionArtwork() {
  return (
    <svg
      className={styles.detections}
      viewBox="0 0 1672 941"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#9cddff" strokeWidth="1.5" opacity="0.85">
        <path d="M635 307 937 328 937 478 632 466Z M635 307 681 305 953 321 937 328 M937 478 953 469 953 321 M821 355h10m-10 0v12m34-12h-10m10 0v12m-34 69h10m-10 0v-12m34 12h-10m10 0v-12" />
        <path d="M1062 466h-12v14m47-14h12v14m-59 67h12m-12 0v-14m59 14h-12m12 0v-14 M1429 442h-12v14m49-14h12v14m-61 72h12m-12 0v-14m61 14h-12m12 0v-14" />
        <path d="M1218 495 1376 508 1433 544 1274 531Z M1218 495v211l56 35 159-24V544 M1274 531v210 M984 448l64 13v87l-64-15Z M1146 550l83 11v146l-83-24Z M1546 616l78 14v-48l-78-17Z" />
        <path d="M1318 559h10m-10 0v12m39-12h-10m10 0v12m-39 61h10m-10 0v-12m39 12h-10m10 0v-12 M1212 807l150 14 40 100 M1212 807v134 M1511 683l111 25 50 30 M1511 683v258" />
      </g>
      <g fill="#c4edff" stroke="#72bde9" strokeWidth="1">
        {[
          [635, 307],
          [937, 328],
          [937, 478],
          [632, 466],
          [1218, 495],
          [1274, 531],
          [1274, 741],
          [1433, 717],
          [984, 448],
          [1048, 548],
          [1146, 550],
          [1229, 707],
          [1212, 807],
          [1362, 821],
        ].map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x - 2.5}
            y={y - 2.5}
            width="5"
            height="5"
          />
        ))}
      </g>
      <path
        d="M590 454C820 766 1042 638 1179 752S1439 774 1497 919"
        fill="none"
        stroke="#9cddff"
        strokeWidth="1.5"
        strokeDasharray="3 6"
        opacity="0.7"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <figure className={styles.scene}>
        <div className={styles.artwork}>
          <Image
            src="/images/warehouse.png"
            alt=""
            fill
            preload
            sizes="(max-aspect-ratio: 1672/941) 178vh, 100vw"
            className={styles.image}
          />
          <DetectionArtwork />
        </div>
      </figure>
      <div className={styles.content}>
        <h1 id="hero-heading" className={styles.title}>
          Operational intelligence for your camera systems
        </h1>
        <p className={styles.description}>
          Sentinel detects relevant events and directs your team’s attention
          where it is needed most.
        </p>
        <AssessmentAction />
      </div>
    </section>
  );
}

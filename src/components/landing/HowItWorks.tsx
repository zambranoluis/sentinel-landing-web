import Image from "next/image";
import { CubeArtwork } from "./CubeArtwork";
import { CubeMotion } from "./CubeMotion";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    name: "Observe.",
    position: "observe",
    path: "M4 24s7-11 20-11 20 11 20 11-7 11-20 11S4 24 4 24Z M31 24a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
  },
  {
    name: "Interpret.",
    position: "interpret",
    path: "M11 7h26v34H11Z M17 16h14 M17 23h14 M17 30h8 M29 30h2",
  },
  {
    name: "Flag.",
    position: "flag",
    path: "M12 41V8 M12 10c9-7 15 7 25 0v18c-10 7-16-7-25 0",
  },
  {
    name: "Review.",
    position: "review",
    path: "M31 20a12 12 0 1 1-24 0 12 12 0 0 1 24 0Z M28 29l13 13",
  },
  {
    name: "Respond.",
    position: "respond",
    path: "M42 24a18 18 0 1 1-36 0 18 18 0 0 1 36 0Z M34 24a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z M26 24a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      tabIndex={-1}
      aria-labelledby="how-it-works-title"
      className={styles.section}
    >
      <Image
        src="/images/how-it-works.png"
        alt=""
        fill
        sizes="100vw"
        className={styles.background}
      />
      <div className={styles.layout}>
        <div className={styles.copy}>
          <h2 id="how-it-works-title" className={styles.title}>
            <span>More visibility into what is happening</span>{" "}
            <span>More precision on where to act</span>
          </h2>
          <p className={styles.description}>
            Sentinel helps turn large volumes of video into prioritised
            information. It monitors configured feeds, flags relevant events and
            presents the context people need to review, decide and respond.
          </p>
        </div>
        <div className={styles.diagram}>
          <svg
            className={styles.connections}
            viewBox="0 0 820 690"
            aria-hidden="true"
            focusable="false"
          >
            <g fill="none" stroke="currentColor">
              <circle cx="410" cy="357" r="140" />
              <circle cx="410" cy="357" r="205" />
              <circle cx="410" cy="357" r="255" />
            </g>
            <g
              className={styles.connectors}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M410 180V265 M200 335 294 355 M620 335 526 355 M290 514 335 462 M530 514 483 462" />
            </g>
            <g className={styles.connectors} fill="currentColor">
              {[
                [410, 180],
                [410, 265],
                [200, 335],
                [294, 355],
                [620, 335],
                [526, 355],
                [290, 514],
                [335, 462],
                [530, 514],
                [483, 462],
              ].map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" />
              ))}
            </g>
          </svg>
          <CubeMotion>
            <CubeArtwork />
          </CubeMotion>
          <ol className={styles.steps} aria-label="How Sentinel works">
            {steps.map((step) => (
              <li
                key={step.position}
                className={`${styles.step} ${styles[step.position]}`}
              >
                <span className={styles.icon} aria-hidden="true">
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    focusable="false"
                  >
                    <path d={step.path} />
                  </svg>
                </span>
                <span>{step.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

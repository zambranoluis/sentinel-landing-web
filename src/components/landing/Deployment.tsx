import Image from "next/image";
import { deployment } from "./content";
import common from "./Sections.module.css";
import styles from "./Deployment.module.css";

const deploymentImages = [
  "/sections/deployment/security-compound-animated.svg",
  "/sections/deployment/surveillance-network-animated.svg",
  "/sections/deployment/surveillance-animated.svg",
];

export function Deployment() {
  return (
    <section
      id="deployment"
      tabIndex={-1}
      aria-labelledby="deployment-title"
      className={`${common.section} ${styles.section}`}
      data-motion-group
    >
      <h2
        id="deployment-title"
        className={`${common.heading} ${styles.heading}`}
        data-motion="intro"
      >
        Built around your operation
      </h2>
      <p className={`${common.lead} ${styles.lead}`} data-motion="intro">
        Sentinel starts with a site assessment to determine compatibility,
        priority areas and deployment requirements. From there, the system is
        installed, configured and tuned to the operational environment.
      </p>
      <ol className={styles.steps} data-motion-group>
        {deployment.map((item, index) => (
          <li key={item.title} data-motion="content">
            <div className={styles.illustration}>
              <Image
                src={deploymentImages[index]}
                width={1672}
                height={941}
                alt=""
                sizes="(max-width: 720px) 132vw, (max-width: 1279px) 80vw, (max-width: 1920px) 41vw, 778px"
                className={styles.image}
              />
            </div>
            <div className={styles.copy}>
              <div className={styles.track}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

import Image from "next/image";
import { capabilities } from "./content";
import { SectionIcon } from "./SectionIcon";
import common from "./Sections.module.css";
import styles from "./Capabilities.module.css";

export function Capabilities() {
  return (
    <section
      id="capabilities"
      tabIndex={-1}
      aria-labelledby="capabilities-title"
      className={`${common.section} ${styles.section}`}
    >
      <div className={styles.introduction} data-motion-group>
        <h2
          id="capabilities-title"
          className={common.heading}
          data-motion="intro"
        >
          Intelligence for real-world operations
        </h2>
        <p className={common.lead} data-motion="intro">
          Sentinel adapts detection models and rules to the operational context
          of each site, supporting security, loss prevention, workplace safety
          and operational visibility.
        </p>
        <div className={styles.mosaic} aria-hidden="true" data-motion="unit">
          {["retail", "forecourt", "building", "warehouse"].map((scene) => (
            <div key={scene} className={styles.scene}>
              <Image
                src={`/images/capabilities-${scene}.webp`}
                alt=""
                fill
                sizes="(max-width: 720px) 50vw, 30vw"
              />
              <span className={styles.bracket} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.cards} data-motion-group>
        {capabilities.map((item, index) => (
          <article
            key={item.id}
            id={item.id}
            tabIndex={-1}
            className={styles.card}
            data-motion="content"
          >
            <span className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={common.icon}>
              <SectionIcon name={item.icon} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

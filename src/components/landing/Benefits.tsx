import Image from "next/image";
import { benefits } from "./content";
import { SectionIcon } from "./SectionIcon";
import common from "./Sections.module.css";
import styles from "./Benefits.module.css";

export function Benefits() {
  return (
    <section
      aria-labelledby="benefits-title"
      className={`${common.section} ${styles.section}`}
      data-motion-group
    >
      <Image
        src="/images/benefits.webp"
        alt=""
        fill
        sizes="100vw"
        className={common.background}
      />
      <h2 id="benefits-title" className={common.heading} data-motion="intro">
        More clarity
        <br />
        More control
      </h2>
      <p className={common.lead} data-motion="intro">
        Improve visibility, direct attention to what matters and give your team
        more context to review and respond.
      </p>
      <div className={styles.benefits} data-motion-group>
        {benefits.map((item, index) => (
          <article key={item.title} data-motion="content">
            <span className={common.icon}>
              <SectionIcon
                name={["pulse", "document", "shield", "camera"][index]}
              />
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

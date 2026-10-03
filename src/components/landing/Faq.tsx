import { faqs } from "./content";
import { FaqDisclosure } from "./FaqDisclosure";
import common from "./Sections.module.css";
import styles from "./Faq.module.css";

export function Faq() {
  return (
    <section
      id="faq"
      tabIndex={-1}
      aria-labelledby="faq-title"
      className={`${common.section} ${styles.section}`}
    >
      <div data-motion-group>
        <h2 id="faq-title" className={common.heading} data-motion="intro">
          The essentials before you get started
        </h2>
        <p className={common.lead} data-motion="intro">
          Direct answers about compatibility, data, alerts and operation.
        </p>
      </div>
      <div className={styles.questions} data-motion="unit">
        {faqs.map((item) => (
          <FaqDisclosure key={item.title} title={item.title}>
            <p>{item.body}</p>
          </FaqDisclosure>
        ))}
      </div>
    </section>
  );
}

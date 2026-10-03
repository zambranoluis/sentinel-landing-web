import { AssessmentAction } from "./AssessmentAction";
import { SectionIcon } from "./SectionIcon";
import common from "./Sections.module.css";
import styles from "./Plans.module.css";

const assessment = [
  "On-site assessment by our team.",
  "Camera and recorder review.",
  "Recommended coverage and capability plan.",
  "Written deployment proposal.",
  "No obligation to proceed.",
];
const packages = [
  "Cameras and AI models included according to the selected package.",
  "Sentinel node rental, with hardware refresh subject to service terms.",
  "Dashboard and available mobile access.",
  "Configured WhatsApp and Telegram alerts with clips and screenshots where applicable.",
  "Report history and export options.",
  "Configurable notification recipients.",
  "Warranty replacement and remote support subject to service terms.",
];

function Features({ items }: { items: string[] }) {
  return (
    <ul className={styles.features}>
      {items.map((item) => (
        <li key={item}>
          <SectionIcon name="check" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Plans() {
  return (
    <section
      id="plans"
      tabIndex={-1}
      aria-labelledby="plans-title"
      className={`${common.section} ${styles.section}`}
      data-motion-group
    >
      <h2 id="plans-title" className={common.heading} data-motion="intro">
        Assess first
        <br />
        Deploy with confidence
      </h2>
      <p className={common.lead} data-motion="intro">
        Sentinel starts with a site assessment. From that assessment, coverage
        is organised into packages with a fixed weekly rate and a defined scope
        based on the cameras, AI models and hardware required.
      </p>
      <div className={styles.plans} data-motion-group>
        <article className={styles.plan} data-motion="content">
          <header>
            <span className={common.icon}>
              <SectionIcon name="document" />
            </span>
            <div>
              <h3>Site Assessment</h3>
              <p className={styles.price}>Free</p>
              <p className={styles.condition}>No obligation to proceed</p>
            </div>
          </header>
          <p>
            For understanding which parts of your current camera infrastructure
            are compatible with Sentinel and what type of deployment can best
            support your operation.
          </p>
          <Features items={assessment} />
          <AssessmentAction />
        </article>
        <article
          className={`${styles.plan} ${styles.package}`}
          data-motion="content"
        >
          <header>
            <span className={common.icon}>
              <SectionIcon name="layers" />
            </span>
            <div>
              <p className={styles.label}>Paid Plan</p>
              <h3 className={styles.packageTitle}>Sentinel Packages</h3>
              <p className={styles.condition}>
                TBD — confirmed after the site assessment
              </p>
            </div>
          </header>
          <p>
            For operations of different sizes, from small camera networks to
            enterprise environments with multiple locations.
          </p>
          <Features items={packages} />
          <button disabled className={common.button}>
            Discuss the Right Package <SectionIcon name="arrow" />
          </button>
        </article>
      </div>
      <article className={styles.addons} data-motion="unit">
        <span className={common.icon}>
          <SectionIcon name="expand" />
        </span>
        <div>
          <h3>Expand coverage as your needs change</h3>
          <p>
            Add cameras, AI models, locations or 24-hour coverage to an active
            package according to the needs of the operation.
          </p>
          <p className={styles.terms}>
            An active Sentinel package is required. Final availability depends
            on compatibility, configuration and deployment requirements.
          </p>
        </div>
        <button disabled className={common.button}>
          See Add-on Options <SectionIcon name="arrow" />
        </button>
      </article>
    </section>
  );
}

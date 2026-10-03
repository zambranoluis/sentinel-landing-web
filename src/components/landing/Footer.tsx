import { Brand } from "./Brand";
import { NavigationLabel } from "./NavigationLabel";
import { footerGroups } from "./navigation";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns} data-motion-group>
        <div className={styles.brand} data-motion="content">
          <Brand />
          <p>
            Operational intelligence for camera infrastructure. Developed in
            Jamaica by CrimsonTide AI.
          </p>
          <address>
            CrimsonTide AI Limited · Kingston, Jamaica · +1 (876) 458-4187
          </address>
        </div>
        {footerGroups.map((group) => (
          <section
            key={group.label}
            aria-labelledby={`footer-${group.label.toLowerCase()}`}
            data-motion="content"
          >
            <h2
              id={`footer-${group.label.toLowerCase()}`}
              className={styles.heading}
            >
              {group.label}
            </h2>
            <ul className={styles.links}>
              {group.items.map((item) => (
                <li key={item.destination}>
                  <NavigationLabel item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className={styles.legal} data-motion="unit">
        <p>
          © 2026 CrimsonTide AI Limited. Sentinel supports detection and review;
          trained personnel remain responsible for decisions and response.
          Camera compatibility and deployment requirements are confirmed through
          a site assessment. Commercial terms are governed by the current
          proposal.
        </p>
        <span>Sentinel</span>
      </div>
    </footer>
  );
}

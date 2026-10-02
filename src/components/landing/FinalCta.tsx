import Image from "next/image";
import { AssessmentAction } from "./AssessmentAction";
import common from "./Sections.module.css";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <section
      aria-labelledby="assessment-title"
      className={`${common.section} ${styles.section}`}
    >
      <div className={styles.panel}>
        <Image
          src="/images/assessment.webp"
          alt=""
          fill
          sizes="(max-width: 720px) 100vw, 90vw"
          className={styles.image}
        />
        <div className={styles.content}>
          <h2 id="assessment-title" className={common.heading}>
            See where Sentinel adds value
          </h2>
          <p className={common.lead}>
            A site assessment helps determine compatibility, priority areas,
            relevant capabilities and deployment requirements. Clear
            recommendations before you commit.
          </p>
          <div className={styles.actions}>
            <AssessmentAction />
            <p>
              Or talk to our team on WhatsApp:{" "}
              <strong>+1 (876) 458-4187</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

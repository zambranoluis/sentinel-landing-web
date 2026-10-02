import Image from "next/image";
import { deployment } from "./content";
import { DeploymentMotion } from "./DeploymentMotion";
import common from "./Sections.module.css";
import styles from "./Deployment.module.css";

export function Deployment() {
  return (
    <section
      id="deployment"
      tabIndex={-1}
      aria-labelledby="deployment-title"
      className={common.section}
    >
      <h2 id="deployment-title" className={common.heading}>
        Built around your operation
      </h2>
      <p className={common.lead}>
        Sentinel starts with a site assessment to determine compatibility,
        priority areas and deployment requirements. From there, the system is
        installed, configured and tuned to the operational environment.
      </p>
      <DeploymentMotion>
        <ol className={styles.steps}>
          {deployment.map((item, index) => (
            <li key={item.title}>
              <Image
                src={`/images/deployment-${["assessment", "installation", "review"][index]}.webp`}
                width={1672}
                height={941}
                alt=""
                sizes="(max-width: 720px) 90vw, 33vw"
                className={styles.image}
              />
              <div className={styles.track}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </DeploymentMotion>
    </section>
  );
}

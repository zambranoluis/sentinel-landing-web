import { HeroScene } from "./HeroScene";
import { AssessmentAction } from "./AssessmentAction";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.content} data-hero-copy data-motion-group>
        <h1 id="hero-heading" className={styles.title} data-motion="hero">
          Operational intelligence for your camera systems
        </h1>
        <p className={styles.description} data-motion="hero">
          Sentinel detects relevant events and directs your team’s attention
          where it is needed most.
        </p>
        <div data-motion="hero">
          <AssessmentAction />
        </div>
      </div>
      <HeroScene />
    </section>
  );
}

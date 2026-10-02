import Image from "next/image";
import { DemoPlayer } from "./DemoPlayer";
import common from "./Sections.module.css";
import styles from "./ProductDemo.module.css";

export function ProductDemo() {
  return (
    <section
      id="product-demo"
      aria-labelledby="demo-title"
      className={`${common.section} ${styles.section}`}
    >
      <Image
        src="/images/demo-background.webp"
        alt=""
        fill
        sizes="100vw"
        className={common.background}
      />
      <div className={styles.introduction}>
        <h2 id="demo-title" className={common.heading}>
          From event to
          <br />
          informed action
        </h2>
        <p className={common.lead}>
          Sentinel monitors configured feeds, flags the event as it is detected
          and brings the available context together so your team can review it
          quickly.
        </p>
      </div>
      <DemoPlayer />
    </section>
  );
}

import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.entry}>
      <h1 className={styles.brand}>
        <Image
          src="/logos/sentinel.svg"
          alt="Sentinel"
          width={896}
          height={544}
          preload
          className={styles.logo}
        />
      </h1>
      <p className={styles.description}>
        Sentinel detects relevant events and directs your team’s attention where
        it is needed most.
      </p>
    </main>
  );
}

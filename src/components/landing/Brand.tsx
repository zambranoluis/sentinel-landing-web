import Image from "next/image";
import { destinationHref } from "./navigation";
import styles from "./Brand.module.css";

export function Brand() {
  return (
    <a
      className={styles.brand}
      href={destinationHref("home")!}
      aria-label="Sentinel home"
      tabIndex={0}
    >
      <Image
        src="/logos/sentinel-icon.svg"
        alt=""
        width={433}
        height={422}
        className={styles.icon}
      />
      <Image
        src="/logos/sentinel-word.svg"
        alt=""
        width={904}
        height={122}
        className={styles.word}
      />
    </a>
  );
}

import { AssessmentAction } from "./AssessmentAction";
import { Brand } from "./Brand";
import { MobileNavigation } from "./MobileNavigation";
import { NavigationLabel } from "./NavigationLabel";
import { primaryNavigation } from "./navigation";
import styles from "./Navbar.module.css";

function Navigation({ label }: { label: string }) {
  return (
    <nav aria-label={label}>
      <ul className={styles.links}>
        {primaryNavigation.map((item) => (
          <li key={item.destination}>
            <NavigationLabel item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Navbar() {
  return (
    <header className={styles.header} id="top">
      <div className={styles.row}>
        <Brand />
        <div className={styles.desktop}>
          <Navigation label="Primary" />
          <AssessmentAction />
        </div>
        <MobileNavigation>
          <Navigation label="Primary mobile" />
          <AssessmentAction />
        </MobileNavigation>
      </div>
    </header>
  );
}

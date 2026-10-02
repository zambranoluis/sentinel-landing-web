import styles from "./AssessmentAction.module.css";

export function AssessmentAction() {
  return (
    <div className={styles.action}>
      <button type="button" disabled className={styles.button}>
        Request a Site Assessment
      </button>
    </div>
  );
}

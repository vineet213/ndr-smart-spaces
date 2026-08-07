import { Container } from "@/components/layout";
import styles from "./DrawnGrid.module.css";

export function DrawnGrid() {
  return (
    <div aria-hidden="true" className={styles.grid}>
      <Container className={styles.container}>
        <div className={styles.columns}>
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className={styles.column} />
          ))}
        </div>
      </Container>
    </div>
  );
}

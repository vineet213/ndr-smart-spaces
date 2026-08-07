import { Container } from "@/components/layout";
import { cx } from "../ui/cx";
import styles from "./DrawnGrid.module.css";

export function DrawnGrid({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cx(styles.grid, className)}>
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

import { Icon } from "../ui/Icon";
import styles from "./MenuButton.module.css";

type MenuButtonProps = {
  open: boolean;
  onToggle: () => void;
};

export function MenuButton({ open, onToggle }: MenuButtonProps) {
  const label = open ? "Close menu" : "Open menu";

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={label}
    >
      <Icon name="menu" className={styles.icon} />
    </button>
  );
}

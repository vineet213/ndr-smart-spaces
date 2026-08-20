import { Container } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import { atlasField } from "@/lib/data/portfolio";
import { AtlasFieldInner } from "./AtlasFieldInner";
import { Reveal } from "./Reveal";
import styles from "./AtlasField.module.css";

export function AtlasField() {
  return (
    <section className={styles.section} aria-label={atlasField.mark}>
      <Reveal variant="fade">
        <div className={styles.plate}>
          <Container>
            <AtlasFieldInner />
          </Container>
        </div>
      </Reveal>
    </section>
  );
}

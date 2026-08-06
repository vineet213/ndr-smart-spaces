import { useCallback, useState } from "react";

export function useDisclosure(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const openPanel = useCallback(() => setOpen(true), []);
  const closePanel = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  return { open, openPanel, closePanel, toggle, setOpen };
}

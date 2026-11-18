// Lets the global prev/next bar drive whichever scenario stage is on screen.
export type StageCtl = { next: () => boolean; prev: () => boolean; label: string };
export const stepper: { stage: StageCtl | null; notify: () => void } = { stage: null, notify: () => {} };

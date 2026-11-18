import type { ComponentType } from "react";
import type { SlideProps } from "./Slide";
import { TitleSlide, ProblemSlide, UsersSlide, WhySlide, PrioritySlide, RoadmapSlide } from "./Context";
import { Init1Slide, Init2Slide, LaunchSlide, MetricsSlide, CloseSlide } from "./Initiatives";

export type SlideDef = {
  id: string;
  title: string;
  /** what this part of the deck is for (shown in the index) */
  purpose: string;
  group: string;
  /** number of extra reveal steps (press → to build) */
  steps?: number;
  component: ComponentType<SlideProps>;
};

export const SLIDES: SlideDef[] = [
  { id: "title", group: "Start", title: "The ask", purpose: "The mandate and my one-line approach", component: TitleSlide },
  { id: "problem", group: "The problem", title: "Why RTO matters", purpose: "Size of the problem and what one RTO costs", component: ProblemSlide },
  { id: "users", group: "The problem", title: "Who we build for", purpose: "Merchant segment we start with, and the people involved", component: UsersSlide },
  { id: "why", group: "The problem", title: "Why orders come back", purpose: "100 COD orders through the journey: where the 30 RTOs start", steps: 6, component: WhySlide },
  { id: "priority", group: "The plan", title: "What we build first", purpose: "Every idea scored, and the rules behind the order", steps: 2, component: PrioritySlide },
  { id: "roadmap", group: "The plan", title: "6-month roadmap", purpose: "MVP → validate → rescue → insights → grow → scale", steps: 5, component: RoadmapSlide },
  { id: "init1", group: "The solution", title: "Initiative 1 · MVP", purpose: "COD confirm + address fix: user flow and key features", component: Init1Slide },
  { id: "init2", group: "The solution", title: "Initiative 2", purpose: "Failed-delivery rescue: user flow and key features", component: Init2Slide },
  { id: "live", group: "The solution", title: "Live prototype", purpose: "Opens the working product: see the solution end to end", component: LaunchSlide },
  { id: "metrics", group: "Measuring it", title: "Metrics", purpose: "North Star, targets and guardrails", component: MetricsSlide },
  { id: "close", group: "Measuring it", title: "Risks + what's next", purpose: "What could break, and life after Month 6", component: CloseSlide },
];

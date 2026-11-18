import type { ComponentType } from "react";
import type { SlideProps } from "./Slide";
import { TitleSlide, ProblemSlide, UsersSlide, WhySlide, PrioritySlide, RoadmapSlide } from "./Context";
import { Init1Slide, Proto1Slide, Init2Slide, Proto2Slide, MetricsSlide, CloseSlide } from "./Initiatives";

export type SlideDef = { id: string; title: string; component: ComponentType<SlideProps> };

export const SLIDES: SlideDef[] = [
  { id: "title", title: "Title", component: TitleSlide },
  { id: "problem", title: "Problem", component: ProblemSlide },
  { id: "users", title: "Users", component: UsersSlide },
  { id: "why", title: "Root causes", component: WhySlide },
  { id: "priority", title: "Prioritisation", component: PrioritySlide },
  { id: "roadmap", title: "Roadmap", component: RoadmapSlide },
  { id: "init1", title: "Initiative 1", component: Init1Slide },
  { id: "proto1", title: "Prototype 1", component: Proto1Slide },
  { id: "init2", title: "Initiative 2", component: Init2Slide },
  { id: "proto2", title: "Prototype 2", component: Proto2Slide },
  { id: "metrics", title: "Metrics", component: MetricsSlide },
  { id: "close", title: "Risks + next", component: CloseSlide },
];

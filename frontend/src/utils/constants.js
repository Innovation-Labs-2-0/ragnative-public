import {
  Cpu,
  Workflow,
  CircuitBoard,
  Brain,
  CalendarCheck,
  Book,
  File,
  Library,
  Inbox,
  FolderKanban,
  FileArchive,
  Notebook,
} from "lucide-react";
export const messageHistorySize = 5;

export const PUBLIC_ROUTE_KEYS = ["sign-in", "sign-up", "page404"];

export const ROLE_LABELS = {
  admin: "Admin",
  user: "User",
  editor: "Editor",
};
export const DashboardColors = [
  "#2E7DFF",
  "#13C2C2",
  "#F4B400",
  "#B156F6",
  "#26C281",
  "#FF7F32",
  "#722ED1",
  "#c2df78ff",
  "#c29ddfff",
];
export const LLMColorMap = {
  OpenAI: "#2E7DFF",
  Gemini: "#13C2C2",
  "Azure OpenAI": "#F4B400",
  Anthropic: "#B156F6",
  Llama: "#26C281",
};

export const getLLMColor = (llmName) => {
  return LLMColorMap[llmName] || DashboardColors[0];
};
export const DashboardIcons = [
  Cpu,
  Workflow,
  CircuitBoard,
  Brain,
  CalendarCheck,
  Book,
  File,
  Library,
  Inbox,
  FolderKanban,
  FileArchive,
  Notebook,
];

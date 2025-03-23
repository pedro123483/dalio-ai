export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant" | "data" | "system";
  createdAt?: Date | undefined;
};

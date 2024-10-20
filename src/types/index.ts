/**
 * The type for a task
 */
export type Task = {
  id: string;
  description: string;
  isComplete: boolean;
  dueDate?: Date;
};

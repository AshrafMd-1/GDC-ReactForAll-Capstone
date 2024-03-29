import { ManageTask } from "../types/RequestTypes";

export const TaskSorterBasedOnStatus = (
  statusId: number,
  tasks: ManageTask[],
) => {
  return tasks.filter((task) => task.status_object.id === statusId);
};

export const TaskConverter = (task: ManageTask) => {
  return {
    id: task.id,
    title: task.title,
    description: task.description.split("|")[0],
    priority: task.description.split("|")[3].split(":")[1],
    due_date: task.description.split("|")[1].split(":")[1],
    completed: task.description.split("|")[2].split(":")[1] === "true",
  };
};

export const DaysRemaining = (dueDate: string) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const due = new Date(new Date(dueDate).setHours(0, 0, 0, 0));
  const diff = due.getTime() - today.getTime();
  if (diff < 0) return -1;
  return Math.ceil(diff / (1000 * 3600 * 24));
};

const GetEmojiBasedOnDays = (days: number) => {
  if (days < 0) {
    return "🤯";
  } else if (days < 3) {
    return "😱";
  } else if (days < 7) {
    return "😨";
  } else if (days < 14) {
    return "😰";
  } else if (days < 30) {
    return "😥";
  } else if (days < 60) {
    return "😓";
  } else {
    return "😌";
  }
};

export const GetCompleteDaysRemainingComponent = (days: string) => {
  return GetEmojiBasedOnDays(DaysRemaining(days));
};

export const GetPriorityColor = (priority: string) => {
  if (priority === "High") {
    return "red";
  } else if (priority === "Medium") {
    return "orange";
  } else {
    return "green";
  }
};

export const GetDateColor = (days: string) => {
  const daysRemaining = DaysRemaining(days);
  if (daysRemaining <= 0) {
    return "red";
  } else if (daysRemaining < 2) {
    return "darkorange";
  } else if (daysRemaining < 3) {
    return "orange";
  } else if (daysRemaining < 4) {
    return "lightorange";
  } else if (daysRemaining < 7) {
    return "yellow";
  } else if (daysRemaining < 14) {
    return "lightgreen";
  } else {
    return "green";
  }
};

export const TaskSorterBasedOnPriorityAndDateAndCompleted = (
  tasks: ManageTask[],
) => {
  return tasks.sort((a, b) => {
    const aPriority = a.description.split("|")[3].split(":")[1];
    const bPriority = b.description.split("|")[3].split(":")[1];
    const aDueDate = DaysRemaining(a.description.split("|")[1].split(":")[1]);
    const bDueDate = DaysRemaining(b.description.split("|")[1].split(":")[1]);
    const aCompleted = a.description.split("|")[2].split(":")[1] === "true";
    const bCompleted = b.description.split("|")[2].split(":")[1] === "true";
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;
    if (aDueDate < bDueDate) return -1;
    if (aDueDate > bDueDate) return 1;
    if (aPriority === "High" && bPriority !== "High") return -1;
    if (aPriority !== "High" && bPriority === "High") return 1;
    return 0;
  });
};

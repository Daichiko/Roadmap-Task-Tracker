import fs from "node:fs/promises";
import path from "node:path";
import * as readline from "node:readline/promises";

const TASK_FILE = path.join(path.dirname(__dirname), "tasks.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

interface Task {
  id: number;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
}

async function loadTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile(TASK_FILE, "utf8");
    return JSON.parse(data) as Task[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    console.error("Error loading tasks:", error.message);
    return [];
  }
}

async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await fs.writeFile(TASK_FILE, JSON.stringify(tasks, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}

async function addTask(description: string): Promise<void> {
  const tasks = await loadTasks();
  const nextId =
    tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
  const now = new Date().toISOString();
  const newTask: Task = {
    id: nextId,
    description,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  console.log(`Task added successfully (ID: ${nextId})`);
}

async function updateTask(id: string, description: string): Promise<void> {
  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) {
    console.error("Error: Task ID must be an integer.");
    return;
  }
  const tasks = await loadTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].description = description;
    tasks[taskIndex].updatedAt = new Date().toISOString();
    await saveTasks(tasks);
    console.log(`Task (ID: ${taskId}) updated successfully.`);
  } else {
    console.error(`Error: Task with ID ${taskId} not found.`);
  }
}

async function deleteTask(id: string): Promise<void> {
  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) {
    console.error("Error: Task ID must be an integer.");
    return;
  }
  const tasks = await loadTasks();
  const initialLength = tasks.length;
  const updatedTasks = tasks.filter((task) => task.id !== taskId);
  if (updatedTasks.length < initialLength) {
    await saveTasks(updatedTasks);
    console.log(`Task (ID: ${taskId}) deleted successfully.`);
  } else {
    console.error(`Error: Task with ID ${taskId} not found.`);
  }
}

async function markInProgress(id: string): Promise<void> {
  await updateTaskStatus(id, "in-progress");
}

async function markDone(id: string): Promise<void> {
  await updateTaskStatus(id, "done");
}

async function updateTaskStatus(
  id: string,
  status: Task["status"]
): Promise<void> {
  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) {
    console.error("Error: Task ID must be an integer.");
    return;
  }
  const tasks = await loadTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    if (tasks[taskIndex].status !== status) {
      tasks[taskIndex].status = status;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      await saveTasks(tasks);
      console.log(`Task (ID: ${taskId}) marked as '${status}'.`);
    } else {
      console.log(`Task (ID: ${taskId}) is already '${status}'.`);
    }
  } else {
    console.error(`Error: Task with ID ${taskId} not found.`);
  }
}

async function listTasks(status?: Task["status"]): Promise<void> {
  const tasks = await loadTasks();
  let filteredTasks = tasks;
  if (status) {
    filteredTasks = tasks.filter((task) => task.status === status);
    console.log(`Tasks with status '${status}':`);
  } else {
    console.log("All Tasks:");
  }

  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  for (const task of filteredTasks) {
    console.log(`  ID: ${task.id}`);
    console.log(`  Description: ${task.description}`);
    console.log(`  Status: ${task.status}`);
    console.log(`  Created At: ${task.createdAt}`);
    console.log(`  Updated At: ${task.updatedAt}`);
    console.log("-".repeat(20));
  }
}

async function main() {
  let input = "exit";

  do {
    input = await rl.question("");

    const args = input.split(/\s+/);

    if (args[0] !== "exit") {
      if (args.length < 2 || args[0] !== "task-cli") {
        console.log("Usage: task-cli <action> [arguments]");
        console.log(
          "Actions: add, update, delete, mark-in-progress, mark-done, list [done|todo|in-progress]"
        );
        continue;
      }
    }

    const action = args[1].toLowerCase();

    switch (action) {
      case "add":
        if (args.length > 2) {
          await addTask(args.slice(2).join(" "));
        } else {
          console.log("Usage: task-cli add <description>");
        }
        break;
      case "update":
        if (args.length > 3) {
          await updateTask(args[2], args.slice(3).join(" "));
        } else {
          console.log("Usage: task-cli update <id> <description>");
        }
        break;
      case "delete":
        if (args.length > 2) {
          await deleteTask(args[2]);
        } else {
          console.log("Usage: task-cli delete <id>");
        }
        break;
      case "mark-in-progress":
        if (args.length > 2) {
          await markInProgress(args[2]);
        } else {
          console.log("Usage: task-cli mark-in-progress <id>");
        }
        break;
      case "mark-done":
        if (args.length > 2) {
          await markDone(args[2]);
        } else {
          console.log("Usage: task-cli mark-done <id>");
        }
        break;
      case "list":
        if (args.length > 2) {
          const status = args[2].toLowerCase() as Task["status"];
          if (["done", "todo", "in-progress"].includes(status)) {
            await listTasks(status);
          } else {
            console.log("Usage: task-cli list [done|todo|in-progress]");
          }
        } else {
          await listTasks();
        }
        break;
      case "exit":
        break;
      default:
        console.log(`Unknown action: ${action}`);
        console.log("Usage: ts-node src/index.ts <action> [arguments]");
        console.log(
          "Actions: add, update, delete, mark-in-progress, mark-done, list [done|todo|in-progress]"
        );
    }
  } while (input !== "exit");
  console.log("salida");
  rl.close();
}

main();

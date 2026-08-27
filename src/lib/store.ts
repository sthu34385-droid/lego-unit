import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "./paths";

let queue: Promise<void> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function isMissingFile(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}

function isJsonParseError(error: unknown): boolean {
  return error instanceof SyntaxError;
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  return enqueue(async () => {
    await ensureDir();
    const filePath = path.join(DATA_DIR, filename);
    try {
      const raw = await fs.readFile(filePath, "utf8");
      if (!raw.trim()) {
        await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      if (isMissingFile(error) || isJsonParseError(error)) {
        await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
        return fallback;
      }
      throw error;
    }
  });
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  return enqueue(async () => {
    await ensureDir();
    const filePath = path.join(DATA_DIR, filename);
    const tmp = `${filePath}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    try {
      await fs.rename(tmp, filePath);
    } catch {
      await fs.copyFile(tmp, filePath);
      await fs.unlink(tmp).catch(() => undefined);
    }
  });
}

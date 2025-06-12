import { serveWithCors } from "../_shared/withCors.ts";

/**
 * Example fetch_jobs function returning a static job list.
 * Replace this with your database logic as needed.
 */
async function fetchJobsFromDb() {
  // This is a placeholder for database logic
  return [{ id: 1, title: "Example Job" }];
}

serveWithCors(async (_req) => {
  const jobs = await fetchJobsFromDb();
  return new Response(JSON.stringify(jobs), {
    headers: { "Content-Type": "application/json" },
  });
});

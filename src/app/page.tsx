import HomePage from "@/components/HomePage";
import { getSiteContent } from "@/lib/content";

// Server component: reads content off disk at build time, so the static export
// still emits fully rendered HTML.
export default async function Home() {
  const content = await getSiteContent();
  return <HomePage content={content} />;
}

import LivePreviewHost from "@/components/dev/LivePreviewHost";
import { getSiteContent } from "@/lib/content";

// Dev-only preview target for /studio. Starts from what is on disk, then
// receives unsaved draft renders over postMessage.
export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  return <LivePreviewHost initial={await getSiteContent()} />;
}

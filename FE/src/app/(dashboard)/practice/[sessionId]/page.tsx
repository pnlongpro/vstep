"use client";

import { PracticeComponent } from "@/components/practice/practice-component";

export default function PracticeSessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return <PracticeComponent sessionId={params.sessionId} />;
}

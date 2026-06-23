import { AppShell } from "@/components/app-shell";
import { CreateFlowShell } from "@/components/create-flow/create-flow-shell";

export default function CreatePage() {
  return (
    <AppShell>
      <main className="page create-page">
        <CreateFlowShell />
      </main>
    </AppShell>
  );
}

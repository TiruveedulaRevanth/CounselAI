import EmpathAIClient from '@/components/empath-ai-client';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <EmpathAIClient />
    </SidebarProvider>
  );
}

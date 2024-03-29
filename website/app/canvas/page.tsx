import Toolbar from '@/components/canvas/toolbar';
import Draw from '@/components/canvas/draw';
import MindMappingProvider from '@/providers/mind-mapping';

export default function Page() {
  return (
    <MindMappingProvider>
      <Draw />
      <Toolbar />
    </MindMappingProvider>
  );
}

import { Button } from '@/components/ui/button';
import Navigator from '@/components/index/Navigator';
import Toolbar from '@/components/index/Toolbar';

export default function Page() {
  return (
    <>
      <Button variant="outline">Button</Button>
      <Toolbar />
      <Navigator />
    </>
  );
}

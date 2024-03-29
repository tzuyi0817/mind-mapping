'use client';

import { useRef, useEffect } from 'react';
import MindMapping from 'mind-mapping';
import { useMindMapping } from '@/providers/mind-mapping';

function Draw() {
  const container = useRef(null);
  const { setupMindMapping } = useMindMapping();

  useEffect(() => {
    if (!container.current) return;
    const mapping = new MindMapping({
      element: container.current,
    });

    setupMindMapping(mapping);
    return () => mapping.destroy();
  }, []);

  return (
    <div className="fixed left-0 top-0 bottom-0 right-0">
      <div
        className="absolute left-0 top-0 w-full h-full"
        ref={container}
      ></div>
    </div>
  );
}

export default Draw;

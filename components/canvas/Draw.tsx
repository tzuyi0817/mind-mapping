'use client';

import { useRef, useState, useEffect } from 'react';
import MindMapping from '@/mindMapping';
import { DEFAULT_MAPPING } from '@/mindMapping/configs/defaultMapping';

function Draw() {
  const container = useRef(null);
  const [mindMapping, setMindMapping] = useState<MindMapping | null>(null);

  useEffect(() => {
    if (!container.current) return;
    const mapping = new MindMapping({
      element: container.current,
      data: DEFAULT_MAPPING,
    });

    setMindMapping(mapping);
    mapping.render();
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

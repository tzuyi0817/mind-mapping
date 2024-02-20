'use client';

import { useRef, useState, useEffect } from 'react';
import MindMapping from 'mind-mapping';

function Draw() {
  const container = useRef(null);
  const [mindMapping, setMindMapping] = useState<MindMapping | null>(null);

  useEffect(() => {
    if (!container.current) return;
    const mapping = new MindMapping({
      element: container.current,
    });

    setMindMapping(mapping);
    return () => mapping.destroy();
  }, []);
  console.log(mindMapping);
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

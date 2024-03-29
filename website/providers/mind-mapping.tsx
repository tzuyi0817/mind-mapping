'use client';

import { createContext, useContext, useRef, type PropsWithChildren } from 'react';
import type MindMapping from 'mind-mapping';

interface MindMappingContext {
  instance: React.MutableRefObject<MindMapping | null>;
  setupMindMapping: (mapping: MindMapping) => void;
}

const mindMappingContext = createContext({} as MindMappingContext);

function MindMappingProvider({ children }: PropsWithChildren) {
  const instance = useRef<MindMapping | null>(null);

  function setupMindMapping(mapping: MindMapping) {
    instance.current = mapping;
  }

  return (
    <mindMappingContext.Provider
      value={{
        instance,
        setupMindMapping,
      }}
    >
      {children}
    </mindMappingContext.Provider>
  );
}

export const useMindMapping = () => useContext(mindMappingContext);

export default MindMappingProvider;

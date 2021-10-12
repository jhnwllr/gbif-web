import React from 'react';
import StickyContext from './StickyContext';

export function StickyReferenceProvider({children, ...props}) {
  return <StickyContext.Provider value={{gbifLocale}} {...props}>
    <div></div>
    {children}
  </StickyContext.Provider>
}
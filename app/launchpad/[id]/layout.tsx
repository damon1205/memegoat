import React from 'react'

export const dynamicParams = false;

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout

"use client"
import React from "react"

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-[1200px] mx-auto">{children}</div>
}

"use client"
import Link from "next/link"
import React from "react"

export const Logo = () => {
  return (
    <Link href={"/"}>
      <span className="text-primary-40 text-lg">MemeGoat</span>
    </Link>
  )
}

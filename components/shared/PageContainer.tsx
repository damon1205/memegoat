"use client"
import React from "react"
import { Container } from "./Container"
import { Header } from "./Header"

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-custom-black min-h-screen text-custom-white relative">
      <Header />
      <Container>
        <div className="pt-[8rem] px-5">{children}</div>
      </Container>
      <div className="fixed top-0 left-0 w-full h-[50px] blur-[200px] bg-primary-20"></div>
      <div className="fixed bottom-0 -right-10 h-[10rem] w-[10rem] blur-[180px] bg-primary-20"></div>
    </div>
  )
}

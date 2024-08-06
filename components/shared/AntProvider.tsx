"use client"
import React from "react"
import { ConfigProvider, theme } from "antd"

export const AntProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            borderRadius: 0,
            colorPrimary: "#2DC653",
            controlHeight: 40,
            colorBgContainer: "#0A0908",
            colorText: "#EBEBEB",
          },
          components: {
            Table: {
              headerBg: "rgb(110,222,138,0.2)",
              colorBgContainer: "rgb(110,222,138,0.01)",
              rowHoverBg: "rgb(110,222,138,0.07)",
            },
            Collapse: {
              headerBg: "rgb(110,222,138,0.1)",
              colorBorder: "rgb(110,222,138,0.2)",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </>
  )
}

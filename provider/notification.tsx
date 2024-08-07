"use client"
import React, { createContext, useState } from "react"

interface NotificationI {
  type: "error" | "pending" | "success"
  title: React.ReactNode
  message: React.ReactNode
  details_link?: string
}

const defaultValues: NotificationI = {
  message: "",
  title: "",
  type: "pending",
}

interface ContextInterfaceI {
  config: ({ ...params }: NotificationI) => void
  values: NotificationI
  openModal?: boolean
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>
}

export const NotificationContext = createContext<ContextInterfaceI>({
  config: () => {},
  values: defaultValues,
})

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { Provider } = NotificationContext
  const [values, setValues] = useState<NotificationI>(defaultValues)
  const [openModal, setOpenModal] = useState(false)
  const notificationConfig = ({ ...params }: NotificationI) => {
    setValues((prev) => ({ ...prev, ...params }))
    setOpenModal(!openModal)
  }
  return (
    <Provider
      value={{ config: notificationConfig, values, openModal, setOpenModal }}
    >
      {children}
    </Provider>
  )
}

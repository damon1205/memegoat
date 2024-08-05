import { NotificationContext } from "@/provider/notification"
import { useContext } from "react"

export const useNotificationConfig = () => {
  const { config } = useContext(NotificationContext)
  return { config }
}

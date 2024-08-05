"use client"
import { NotificationContext } from "@/provider/notification"
import { Avatar, Button, Modal } from "antd"
import Link from "next/link"
import React, { useContext } from "react"
import { BiError } from "react-icons/bi"
import { CgCheck } from "react-icons/cg"
import { FaExternalLinkAlt } from "react-icons/fa"
import { MdPending } from "react-icons/md"

// *************************************************** How To use Notifaction ***************************************************

// 1. Import the notification hook
// import { useNotificationConfig } from "@/hooks/useNotification"

// 2. Deconstruct hook
// const { config } = useNotificationConfig()

// 3. call the config function
// config({type: "error" | "pending" | "success", title: React.ReactNode, message: React.ReactNode, details_link?: string})

export const NotificationModal = () => {
  const { openModal, setOpenModal, values } = useContext(NotificationContext)
  const closeModal = () => setOpenModal && setOpenModal(false)
  return (
    <>
      <>
        <Modal
          open={openModal}
          onCancel={closeModal}
          closeIcon={null}
          footer={null}
          styles={{
            mask: { backdropFilter: "blur(2px)" },
            content: {
              background: "#191B19",
              border: "1px solid #242624",
              borderRadius: 8,
            },
            header: { background: "transparent" },
          }}
        >
          <div className="my-3 text-[16px]">
            <div className="flex items-center justify-center mb-5">
              {values.type === "success" ? (
                <Avatar.Group>
                  <Avatar src="/logo.svg" className="border-none" size={70} />
                  <Avatar size={70} className="bg-primary-50">
                    <CgCheck size={35} />
                  </Avatar>
                </Avatar.Group>
              ) : values.type === "pending" ? (
                <Avatar.Group>
                  <Avatar src="/logo.svg" className="border-none" size={70} />
                  <Avatar size={70} className="bg-yellow-500">
                    <MdPending size={35} />
                  </Avatar>
                </Avatar.Group>
              ) : (
                <Avatar.Group>
                  <Avatar src="/logo.svg" className="border-none" size={70} />
                  <Avatar size={70} className="bg-red-500">
                    <BiError size={35} />
                  </Avatar>
                </Avatar.Group>
              )}
            </div>

            <div className="text-center text-[16px]">
              <p className="mb-2 font-semibold">{values.title}</p>
              <div className="text-white/60">{values.message}</div>
            </div>

            <div className="my-7">
              {values.type === "error" ? (
                <Button
                  onClick={closeModal}
                  danger
                  type="primary"
                  className="h-[45px] w-full rounded-sm"
                >
                  Cancel
                </Button>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  {values.details_link ? (
                    <Link
                      target="_blank"
                      href={values.details_link}
                      className={`${values.type === "success" ? "text-primary-50 hover:text-primary-50" : "text-yellow-500 hover:text-yellow-500"} w-full flex items-center gap-2 justify-center`}
                    >
                      <p>View details</p>
                      <FaExternalLinkAlt size={18} />
                    </Link>
                  ) : (
                    <></>
                  )}
                  <button
                    onClick={closeModal}
                    className={`h-[45px] w-full rounded-sm ${values.type === "success" ? "bg-primary-50" : "bg-yellow-500"} font-bold`}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </>
    </>
  )
}

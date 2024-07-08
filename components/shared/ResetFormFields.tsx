import React, { useState } from "react"
import { BiReset } from "react-icons/bi"
import Modal from "antd/es/modal/Modal"
import { IoMdCloseCircle } from "react-icons/io"
import { Button } from "antd"

interface propsI {
  resetForm: () => void
}

export const ResetFormFields: React.FC<propsI> = ({ resetForm }) => {
  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => setOpenModal(!openModal)
  return (
    <>
      <div
        className="flex flex-col items-center cursor-pointer p-1 px-2 rounded-sm transition-all hover:bg-[#ffffff1e]"
        onClick={toggleModal}
      >
        <BiReset />
        <p className="text-sm">Reset</p>
      </div>
      <Modal
        open={openModal}
        onCancel={toggleModal}
        title={<p className="text-primary-40">Are you sure?</p>}
        closeIcon={<IoMdCloseCircle className="text-primary-20" />}
        footer={null}
        styles={{
          mask: { backdropFilter: "blur(7px)" },
          content: {
            background: "rgba(16,69,29,0.15)",
            border: "1px solid rgba(16,69,29,0.85)",
          },
          header: { background: "transparent" },
        }}
      >
        <div>
          <p className="text-[16px]">
            You are going to reset all the values in this form to their
            defaults.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Button
              size="large"
              onClick={toggleModal}
              className="bg-transparent text-primary-40 border-primary-100"
            >
              Cancel
            </Button>
            <Button
              size="large"
              onClick={() => {
                resetForm()
                toggleModal()
              }}
              type="primary"
              className=""
            >
              Reset
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

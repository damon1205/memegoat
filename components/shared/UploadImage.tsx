"use client"
import { Avatar } from "antd"
import { NamePath } from "antd/es/form/interface"
import React, { useState } from "react"
import { BiUpload } from "react-icons/bi"
import { FaCloudUploadAlt } from "react-icons/fa"
import { Oval } from "react-loading-icons"

export const UploadImage = ({
  setFieldValue,
  field_name,
  hideRecommendation,
}: {
  setFieldValue: (name: NamePath, value: string) => void
  field_name?: string
  hideRecommendation?: boolean
}) => {
  const [image_, setImage_] = useState("/upload.png")
  const [isLoading, setIsLoading] = useState(false)
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const value = URL.createObjectURL(file as never)
    setIsLoading(true)
    setImage_(value)
    setFieldValue(field_name || "token_image", file as any)
    setIsLoading(false)
  }

  return (
    <div className="">
      <div>
        {isLoading ? (
          <div className="inline-flex flex-col">
            <div className="w-[128px] h-[128px] relative rounded-none">
              <Avatar
                src={image_}
                size={128}
                className="border-[1px] border-primary-70 rounded-none bg-primary-90/40 hover:bg-primary-80/40"
              >
                <FaCloudUploadAlt />
              </Avatar>
              <div className="absolute bg-gray-900/70 top-0 left-0 h-[100%] w-[100%] rounded-none flex flex-col items-center justify-center">
                <Oval />
              </div>
            </div>

            {!hideRecommendation && (
              <div>
                <p className="text-primary-50">
                  <small>We recommend an image of at least 400x400.</small>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="inline-flex flex-col">
            <label htmlFor="token_image" className="cursor-pointer relative">
              <Avatar
                src={image_}
                size={128}
                className="border-[1px] border-primary-70 rounded-none bg-primary-90/40 hover:bg-primary-80/40"
              >
                <BiUpload />
              </Avatar>
            </label>
            <input
              type="file"
              style={{ display: "none" }}
              id="token_image"
              accept=".png,.jpg,.svg,.jpeg"
              onChange={onChangeImage}
            />
            {!hideRecommendation && (
              <div>
                <p className="text-primary-50">
                  <small>We recommend an image of at least 400x400.</small>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

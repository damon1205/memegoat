"use client"
import { uploadToGaia } from "@/utils/helpers"
import { Avatar } from "antd"
import { NamePath } from "antd/es/form/interface"
import React, { useState } from "react"
import { BiUpload } from "react-icons/bi"
import { FaCloudUploadAlt } from "react-icons/fa"
import { Oval } from "react-loading-icons"
import { useNotificationConfig } from "@/hooks/useNotification"

export const UploadImage = ({
  setFieldValue,
  field_name,
  hideRecommendation,
  initialValue
}: {
  setFieldValue: (name: NamePath, value: string) => void
  field_name?: string
  hideRecommendation?: boolean
  initialValue: string | null
}) => {
  const { config } = useNotificationConfig()
  const [image_, setImage_] = useState<string | null>(initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = e.target.files![0];
      const filename = file.name;
      const mimeType = file.type;
      const value = URL.createObjectURL(file as never);
      const fileUrl = await uploadToGaia(filename.replace(/ /g, '-'), file, mimeType);
      console.log(fileUrl)
      if (fileUrl === "") {
        setIsLoading(false)
        config({ message: "Please connect Wallet", title: 'Minter', type: 'error' })
        return;
      }
      setFieldValue(field_name || "token_image", fileUrl);
      setImage_(value);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false)
      if (e instanceof Error) {
        config({ message: e.message, title: 'Minter', type: 'error' })
      } else {
        config({ message: "An unknown error occurred", title: 'Minter', type: 'error' })
      }
    }
  };

  return (
    <div className="">
      <div>
        {isLoading ? (
          <div className="inline-flex flex-col">
            <div className="w-[128px] h-[128px] relative rounded-none">
              <Avatar
                src={image_}
                size={128}
                className="border-[1px] border-primary-70 rounded-none bg-transparent hover:bg-primary-100/25"
              >
                <FaCloudUploadAlt />
              </Avatar>
              <div className="absolute top-0 left-0 h-[100%] w-[100%] rounded-none flex flex-col items-center justify-center">
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
                className="border-[1px] border-primary-70 rounded-none bg-transparent hover:bg-primary-100/25"
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

"use client"
import { uploadToGaia } from "@/utils/helpers"
import { Avatar } from "antd"
import { NamePath } from "antd/es/form/interface"
import React, { useState } from "react"
import { BiUpload } from "react-icons/bi"
import { FaCloudUploadAlt } from "react-icons/fa"
import { Oval } from "react-loading-icons"
import { toast } from "react-hot-toast"

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
  const [image_, setImage_] = useState<string | null>(initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files![0];
    const filename = file.name;
    const mimeType = file.type;
    const value = URL.createObjectURL(file as never);
    const fileUrl = await uploadToGaia(filename.replace(/ /g, '-'), file, mimeType);
    console.log(fileUrl)
    if (fileUrl === "") {
      console.log('sjd,fj')
      setIsLoading(false)
      toast.error("Please connect Wallet")
      return;
    }
    setFieldValue(field_name || "token_image", fileUrl);
    setImage_(value);
    setIsLoading(false);
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

"use client";
import { useRef, } from "react";
import { Camera, FileEarmark, Stars, Upload } from "react-bootstrap-icons";
import Link from "next/link";
import { useImage, useProcessedImage } from "@/components/ImageContext";

export default function UploadPhoto() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useImage();
  const [, setProcessedImage] = useProcessedImage();

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var base64data = reader.result as string;
      const processedData = base64data.split(",")[1];
      setProcessedImage({
        base64Data: processedData,
        fileType: file.type,
      });
    };
    reader.readAsDataURL(file);
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(URL.createObjectURL(i));
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <section className="tan-background h-full">
      <div className="flex flex-col items-center w-full h-full overflow-y-auto p-6">
        <div className="grow flex flex-col items-center justify-center">
          {image ? (
            <img src={image} alt='user image' />
          ) : (
            <p className="text-center text-lg">Add a photo of the style you love. We&apos;ll help you add it to your wardrobe</p>
          )}
        </div>
        <div className="w-full">
          {image ? (
            <Link href="/recommended-products">
              <button className="slime-background flex items-center justify-center gap-2 w-full rounded-full p-4 text-lg font-semibold" >
                <Stars />
                  Recommended products
              </button>
            </Link>
          ): (
            <>
              <div className="mb-2">
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onImageChange}
                  id="cameraInput"
                />
                  <label htmlFor="cameraInput">
                    <button
                      className="flex items-center justify-center gap-2 w-full rounded-full p-4 text-lg font-semibold dark-background"
                      onClick={handleUploadClick}
                      type="button"
                    >
                      <Camera />
                      Open Camera
                    </button>
                  </label>
                </div>
              <div>
                <input
                  className="hidden"
                  id="uploadInput"
                  accept="image/*"
                  ref={fileInputRef}
                  type="file"
                  onChange={onImageChange}
                />
                <label htmlFor="uploadInput">
                  <button
                    className="flex items-center justify-center gap-2 w-full rounded-full p-4 text-lg font-semibold bg-white"
                    onClick={handleUploadClick}
                    type="button"
                  >
                    <Upload />
                    Upload Photo 
                  </button>
                </label>
              </div>   
            </>
          )}
        </div>
      </div>
    </section>
  );
}

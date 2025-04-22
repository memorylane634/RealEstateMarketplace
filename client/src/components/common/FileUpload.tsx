import React, { ChangeEvent, InputHTMLAttributes, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  buttonText?: string;
};

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ buttonText = "Upload File", className, multiple, accept, onChange, ...props }, ref) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-full border-2 border-dashed border-gray-300 rounded-md px-6 py-8 text-center">
          <Button
            type="button"
            variant="outline"
            className="mx-auto"
            onClick={handleClick}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            {multiple ? 'Upload files' : 'Upload a file'} {accept && `(${accept})`}
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          {...props}
        />
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;

import React from "react";
import DocumentDialog from "./dialog";
import { useDropzone } from "react-dropzone";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { styles } from "@/app/styles";
const DocumentActions = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [fileName, setFileName] = React.useState<string>("");
  const [fileSize, setFileSize] = React.useState<string>("");
  const [fileType, setFileType] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const hiddenInputRef = React.useRef<HTMLInputElement>(null);

  const fileExtension = fileType.split("/").pop()?.toUpperCase();
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    // file size in MB
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(fileSizeInMB);
    setFileType(file.type);
    setSelectedFile(file);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: onDrop,
    disabled: !!selectedFile,
  });

  // handle file submit
  async function handleSubmit() {
    try {
      const form = new FormData();
      form.append("file", selectedFile!);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: form,
      });
      const result = response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <DocumentDialog
        open={open}
        setOpen={setOpen}
        title="Upload a document"
        description="PDF, Word, or plain text. Up to 50MB."
        onSubmit={handleSubmit}
      >
        {/* react dropzone here */}
        <div
          {...getRootProps({ className: "dropzone" })}
          className={`border-2 border-dashed rounded-md p-1 text-center transition-colors mb-5 
            ${selectedFile ? "cursor-not-allowed opacity-50 border-muted-foreground/25 " : " cursor-pointer border-muted-foreground/25 hover:border-primary/50"} ${isDragActive ? "border-primary bg-primary/5" : ""}`}
        >
          <input
            type="file"
            name={fileName}
            style={{ opacity: 0 }}
            ref={hiddenInputRef}
          />
          <input {...getInputProps()} />
          <div className="py-3">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm font-medium text-black">Drag a file here</p>
              <span className="text-xs text-muted-foreground">
                or choose one from your computer
              </span>
              <Button
                type="button"
                disabled={!!selectedFile}
                variant="outline"
                className="mt-2 bg-white px-4 hover:bg-white cursor-pointer"
              >
                Choose file
              </Button>
            </div>
          </div>
        </div>
        {/* upload status card here */}
        {selectedFile && (
          <div className="p-2 flex items-center border border-solid rounded-md">
            {/* filename and size */}
            <div className="flex items-center w-full justify-between">
              {/* name and round */}
              <div className="flex items-center justify-center gap-2">
                {/* the round div */}
                <div
                  className={`w-8 h-8 p-3 rounded-sm flex items-center justify-center ${styles.primarySoftBgColor}`}
                >
                  <p className={`text-xs ${styles.primaryTextColor}`}>
                    {fileExtension}
                  </p>
                </div>
                {/* name */}
                <p className="font-normal text-sm">{fileName}</p>
              </div>
              {/* size */}
              <p className="font-normal text-sm">
                {fileSize}
                {` MB`}
              </p>
            </div>
            {/* progress */}
          </div>
        )}
        {/* footer */}
      </DocumentDialog>
    </div>
  );
};

export default DocumentActions;

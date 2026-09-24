import React from "react";
import DocumentDialog from "./dialog";
import { FileRejection, useDropzone } from "react-dropzone";
import { Check, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { styles } from "@/app/styles";
import { json } from "node:stream/consumers";
import { useRouter } from "next/navigation";

type Phase = "idle" | "uploading" | "done" | "error";
const STEPS = [
  "Uploading file",
  "Extracting text",
  "Generating embeddings",
  "Indexing for search",
];
const DocumentActions = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [file, setFile] = React.useState<string>("");
  const [fileSize, setFileSize] = React.useState<string>("");
  const [fileType, setFileType] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [progress, setProgress] = React.useState<number>(0);
  const [message, setMessage] = React.useState<string | null>(null);
  const [currentStep, setCurrentStep] = React.useState<number>(-1);

  const hiddenInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fileExtension = fileType.split("/").pop()?.toUpperCase();
  const uploading = phase === "uploading";

  function reset() {
    setFile("");
    setFileSize("");
    setFileType("");
    setSelectedFile(null);
    setPhase("idle");
    setProgress(0);
    setCurrentStep(-1);
    setMessage(null);
  }

  function close() {
    if (uploading) return;
    reset();
    setOpen(false);
  }
  const onDrop = (acceptedFiles: File[]) => {
    const dropped = acceptedFiles[0];
    setMessage(null);
    setFile(dropped.name);
    // file size in MB
    const fileSizeInMB = (dropped.size / (1024 * 1024)).toFixed(2);
    setFileSize(fileSizeInMB);
    setFileType(dropped.type);
    setSelectedFile(dropped);
  };

  const onDropRejected = (rejections: FileRejection[]) => {
    setMessage(
      rejections[0].errors[0].code === "file-too-large"
        ? "This file is larger than 50MB."
        : "Only PDF, Word and plain text files are supported.",
    );
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
    onDrop,
    onDropRejected,
    disabled: !!selectedFile,
  });

  // handle file submit
  async function handleSubmit() {
    if (!selectedFile) return;
    setMessage(null);
    setPhase("uploading");
    setProgress(0);
    setCurrentStep(0); // step 1 : uploading

    const form = new FormData();
    form.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/documents");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      const body = JSON.parse(xhr.responseText || "{}");
      if (xhr.status === 201) {
        setPhase("done");
        setProgress(100);
        setCurrentStep(1); // server is now extracting the text
        router.refresh();
      } else if (xhr.status === 409) {
        setPhase("error");
        setMessage(
          body.message ?? "This document is already in your workspace.",
        );
        setProgress(0);
        setCurrentStep(0);
      } else {
        setPhase("error");
        setMessage(body.message ?? "Upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setPhase("error");
      setMessage("Upload failed. Please check your connection.");
    };
    xhr.send(form);
    // try {
    //   const form = new FormData();
    //   form.append("file", selectedFile!);

    //   const response = await fetch("/api/documents", {
    //     method: "POST",
    //     body: form,
    //   });
    //   const result = response.json();
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  const footer =
    phase === "done" ? (
      <Button
        onClick={close}
        className={`${styles.primaryBgColor} ${styles.primaryHoverBgColor}`}
      >
        Done
      </Button>
    ) : phase === "error" ? (
      <Button variant="outline" onClick={reset}>
        Choose another file
      </Button>
    ) : (
      <>
        <Button variant="outline" onClick={close} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedFile || uploading}
          className={`${styles.primaryBgColor} ${styles.primaryHoverBgColor}`}
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </>
    );

  return (
    <div>
      <DocumentDialog
        open={open}
        setOpen={(next) => (next ? setOpen(true) : close())} // it open the dialog and close the dialog via the close icon at the top right.
        title="Upload a document"
        description="PDF, Word, or plain text. Up to 50MB."
        footer={footer}
      >
        {/* react dropzone here */}
        <div
          {...getRootProps({ className: "dropzone" })}
          className={`border-2 border-dashed rounded-md text-center transition-colors mb-4 
            ${selectedFile ? "cursor-not-allowed opacity-50 border-muted-foreground/25 " : " cursor-pointer border-muted-foreground/25 hover:border-primary/50"} ${isDragActive ? "border-primary bg-primary/5" : ""}`}
        >
          <input
            type="file"
            name={file}
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
          <div className="p-2 flex flex-col items-start border border-solid rounded-md">
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
                <p className="font-normal text-sm">{file}</p>
              </div>
              {/* size */}
              <p className="font-normal text-sm">
                {fileSize}
                {` MB`}
              </p>
            </div>

            {currentStep > 0 && (
              <>
                {/* progress */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-[width] duration-200 ${styles.primaryBgColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{STEPS[currentStep]}</span>
                  {uploading && <span>{progress}%</span>}
                </div>

                {/* the 4 steps */}
                <ul className="mt-3 space-y-2">
                  {STEPS.map((step, index) => {
                    const done = index < currentStep;
                    const running = index === currentStep;
                    return (
                      <li
                        key={step}
                        className={`flex items-center gap-2 text-[13px] ${
                          done || running ? "" : "text-muted-foreground/60"
                        }`}
                      >
                        {done ? (
                          <span
                            className={`flex size-4 items-center justify-center rounded-full ${styles.primaryBgColor}`}
                          >
                            <Check className="size-2.5 text-white" />
                          </span>
                        ) : running ? (
                          <Loader2
                            className={`size-4 animate-spin ${styles.primaryTextColor}`}
                          />
                        ) : (
                          <span className="size-4 rounded-full border border-muted-foreground/30" />
                        )}
                        {step}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  {uploading
                    ? "Keep this window open while the file uploads."
                    : "You can close this window. We keep working in the background."}
                </p>
              </>
            )}
          </div>
        )}
        {message && (
          <p role="alert" className="mt-3 text-[13px] text-destructive">
            {message}
          </p>
        )}
      </DocumentDialog>
    </div>
  );
};

export default DocumentActions;

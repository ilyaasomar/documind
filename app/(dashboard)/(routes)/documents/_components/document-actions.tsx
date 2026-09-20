import React from "react";
import DocumentDialog from "./dialog";

const DocumentActions = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <div>
      <DocumentDialog
        open={open}
        setOpen={setOpen}
        title="Upload a document"
        description="PDF, Word, or plain text. Up to 50MB."
      >
        {/* react dropzone here */}

        {/* upload status card here */}

        {/* footer */}
      </DocumentDialog>
    </div>
  );
};

export default DocumentActions;

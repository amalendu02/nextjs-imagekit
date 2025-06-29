"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //optional validation

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;    // added this line
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;   // added this line
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      
      if (!authRes.ok) {
        const errorData = await authRes.json();
        throw new Error(errorData.error || "Authentication failed");
      }
      
      const auth = await authRes.json();

      if (!auth.authenticationParameters) {
        throw new Error("Authentication failed - missing parameters");
      }

      const { signature, expire, token } = auth.authenticationParameters;

      if (!signature || !expire || !token) {
        throw new Error("Authentication failed - missing required parameters");
      }

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature,
        expire,
        token,
        onProgress: (event) => {
          if(event.lengthComputable && onProgress){
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent))
          }
        },
        
      });
      onSuccess(res)
    } catch (error) {
        console.error("Upload failed", error)
        setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
        setUploading(false)
    }
  };

//   return (
//     <>
//       <input
//         type="file"
//         accept={fileType === "video" ? "video/*" : "image/*"}
//         onChange={handleFileChange}
//       />
//       {uploading && <span>Loading....</span>}
//     </>
//   );


// updating this section with 

return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept={fileType === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      
      {uploading && (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-blue-500">Uploading...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );


};

export default FileUpload;
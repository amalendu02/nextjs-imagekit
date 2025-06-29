"use client";
import FileUpload from "./components/FileUpload";
import { useState } from "react";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const handleUploadSuccess = (res: any) => {
    console.log("Upload successful:", res);
    setUploadedFile(res);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          File Upload
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <FileUpload onSuccess={handleUploadSuccess} />
          
          {uploadedFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-green-800 font-semibold mb-2">Upload Successful!</h3>
              <p className="text-green-700 text-sm">
                File URL: <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer" className="underline">{uploadedFile.url}</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";
import FileUpload from "./components/FileUpload";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleUploadSuccess = (res: any) => {
    console.log("Upload successful:", res);
    setUploadedFile(res);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            File Upload
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {session?.user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
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
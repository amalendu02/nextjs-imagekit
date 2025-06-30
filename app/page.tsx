"use client";
import FileUpload from "./components/FileUpload";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  /* 🚦 Redirect to /login if the user is not authenticated */
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  /* 📤 Callback runs after a successful upload */
  const handleUploadSuccess = (res: any) => {
    console.log("Upload successful:", res);
    setUploadedFile(res);
  };

  /* 🔐 Handle logout */
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  /* ⏳ While NextAuth is figuring out the session */
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  /* 🚫 Don’t render anything if we’ve already triggered the redirect */
  if (status === "unauthenticated") return null;

  /* ✅ Main UI */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">File Upload</h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-600 truncate">
              Welcome,&nbsp;{session?.user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
          <FileUpload onSuccess={handleUploadSuccess} />

          {uploadedFile && (
            <p className="mt-4 text-green-600">
              File uploaded successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

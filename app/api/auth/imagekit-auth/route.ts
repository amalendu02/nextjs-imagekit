import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
      return Response.json(
        { error: "IMAGEKIT_PRIVATE_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_PUBLIC_KEY) {
      return Response.json(
        { error: "NEXT_PUBLIC_PUBLIC_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });

    return Response.json({
      authenticationParameters,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("ImageKit authentication error:", error);
    return Response.json(
      {
        error: "Authentication for ImageKit failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
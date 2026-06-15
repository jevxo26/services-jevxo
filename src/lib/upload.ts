const IMGBB_API_KEY = "a6c948ab64f7987bbf9e5477cde3a1cb";

/**
 * Uploads a file (image) to ImgBB and returns the uploaded image URL.
 * 
 * @param file - The Image file to upload.
 * @returns Promise<string> - The URL of the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success && result.data && result.data.url) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || "Failed to upload image to ImgBB");
    }
  } catch (error: any) {
    console.error("ImgBB upload error:", error);
    throw new Error(error.message || "Image upload failed");
  }
};

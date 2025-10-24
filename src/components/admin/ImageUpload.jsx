import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cloudinary } from "../../lib/supabase";

const ImageUpload = ({ onUploadComplete, existingImage = null, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImage);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Upload to Cloudinary
      const { data, error: uploadError } = await cloudinary.uploadImage(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Call parent callback with upload data
      if (onUploadComplete) {
        onUploadComplete({
          url: data.url,
          publicId: data.publicId,
          width: data.width,
          height: data.height,
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      setPreview(existingImage);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onUploadComplete) {
      onUploadComplete(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-primary mb-2">
        {label}
      </label>

      {!preview ? (
        // Upload Area
        <div
          onClick={handleClick}
          className="relative border-2 border-dashed border-sage-light rounded-lg p-8 text-center hover:border-accent hover:bg-sage-light/30 transition-quick cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">
                  Uploading to Cloudinary...
                </p>
                <div className="max-w-xs mx-auto bg-sage-light rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-secondary">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-sage-light rounded-lg flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-primary font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-secondary">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Preview Area
        <div className="relative border border-sage-light rounded-lg overflow-hidden bg-white">
          <div className="aspect-video w-full bg-sage-light/30 flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-2 right-2 p-2 bg-white hover:bg-red-50 rounded-lg shadow-md transition-quick disabled:opacity-50"
            title="Remove image"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>

          {/* Change Button */}
          <div className="p-4 border-t border-sage-light">
            <button
              onClick={handleClick}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sage-light hover:bg-sage-medium rounded-lg transition-quick disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="font-medium text-primary">Change Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Helper Text */}
      {!error && !uploading && (
        <p className="mt-2 text-xs text-secondary">
          Images will be optimized and stored on Cloudinary
        </p>
      )}
    </div>
  );
};

export default ImageUpload;

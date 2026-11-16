import { useRef, useState } from "react";
import { ImagePlus, Loader2, Replace, Trash2 } from "lucide-react";
import { cloudinary } from "../../lib/supabase";

const ImageUpload = ({ onUploadComplete, existingImage = null }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImage);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  // Follow changes made by the parent, such as loading a saved story.
  const [seen, setSeen] = useState(existingImage);
  if (existingImage !== seen) {
    setSeen(existingImage);
    setPreview(existingImage);
  }

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 10 * 1024 * 1024) return setError("The image must be smaller than 10 MB.");

    setError(null);
    setUploading(true);
    const { data, error: uploadError } = await cloudinary.uploadImage(file);
    setUploading(false);
    if (uploadError) {
      setError(uploadError.message || "Upload failed.");
      return;
    }
    setPreview(data.url);
    setSeen(data.url);
    onUploadComplete?.(data);
  };

  const remove = () => {
    setPreview(null);
    setSeen(null);
    if (inputRef.current) inputRef.current.value = "";
    onUploadComplete?.(null);
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

      {preview ? (
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="relative aspect-[16/9] bg-muted">
            <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="animate-spin text-white" />
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t border-line bg-surface p-2.5">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn btn-secondary btn-sm flex-1">
              <Replace size={15} /> Replace
            </button>
            <button type="button" onClick={remove} disabled={uploading} className="btn btn-ghost btn-sm text-danger">
              <Trash2 size={15} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
          disabled={uploading}
          className={`flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center transition-colors ${
            dragging ? "border-brand bg-brand-soft" : "border-line-strong bg-muted hover:border-brand"
          }`}
        >
          {uploading ? (
            <Loader2 className="animate-spin text-brand" />
          ) : (
            <>
              <ImagePlus size={26} className="text-ink-3" />
              <span className="text-[14px] font-semibold text-ink">Add cover image</span>
              <span className="text-[12px] text-ink-3">Drop a file or click. 16:9 works best, up to 10 MB.</span>
            </>
          )}
        </button>
      )}
      {error && <p role="alert" className="mt-2 text-[13px] text-danger">{error}</p>}
    </div>
  );
};

export default ImageUpload;

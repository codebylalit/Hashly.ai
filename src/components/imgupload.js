import { ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";

const ImageUpload = ({ onUpload, selectedImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onUpload(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload(null, null);
  };

  return (
    <div>
      {!preview ? (
        <div
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`relative border border-dashed rounded-lg p-6 transition-all ${
            dragActive
              ? "border-purple-400 bg-purple-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <input
            type="file"
            onChange={handleChange}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2">
            <div
              className={`p-2 rounded-full ${
                dragActive ? "bg-purple-100" : "bg-gray-100"
              }`}
            >
              <Upload
                className={`h-5 w-5 ${
                  dragActive ? "text-purple-500" : "text-gray-400"
                }`}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-700">
                Drop your image here
              </p>
              <p className="text-xs text-gray-400">or click to browse</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-white">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-32 object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-white transition-all"
          >
            <X className="h-3 w-3" />
          </button>
          {selectedImage && (
            <div className="px-3 py-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {selectedImage.name} ({Math.round(selectedImage.size / 1024)}{" "}
                KB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ImageUpload;

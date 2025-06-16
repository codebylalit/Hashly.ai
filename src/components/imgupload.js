import { ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";

const ImageUpload = ({ onImageSelect, onPreviewChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPreviewChange(e.target.result);
        onImageSelect(file);
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
    onPreviewChange(null);
    onImageSelect(null);
  };

  return (
    <div>
      <div
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative border border-dashed rounded-lg p-6 transition-all ${
          dragActive
            ? "border-accent-teal bg-accent-teal/10"
            : "border-border-light hover:border-accent-teal/50 bg-background-main/50"
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
              dragActive ? "bg-accent-teal/20" : "bg-background-main"
            }`}
          >
            <Upload
              className={`h-5 w-5 ${
                dragActive ? "text-accent-teal" : "text-primary-main"
              }`}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-primary-main">
              Drop your image here
            </p>
            <p className="text-xs text-primary-light">or click to browse</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

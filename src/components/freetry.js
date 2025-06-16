import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Sparkles,
  Loader,
  Image as ImageIcon,
  BookOpen,
  Heart,
  AlertCircle,
  Copy,
  Check,
  LogIn,
  X,
  Wand2,
  Brain,
  SparklesIcon,
  Palette,
  MessageSquare,
  Hash,
  ChevronDown,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ImageUpload from "./imgupload";

// Initialize Google AI
const genAI = new GoogleGenerativeAI("AIzaSyA4LQ-Ic5Mo35NJ-ECVq3okfbw31uQSrcs");

const TryScreen = () => {
  const [generationMethod, setGenerationMethod] = useState("mood");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [captionLength, setCaptionLength] = useState("medium");
  const [customInput, setCustomInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("happy");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const lengthConfigs = {
    short: {
      description: "1-2 sentences",
      wordCount: "10-15",
      charLimit: 80,
      prompt: "Create a very brief and concise caption",
    },
    medium: {
      description: "2-3 sentences",
      wordCount: "20-35",
      charLimit: 150,
      prompt: "Create a balanced, medium-length caption",
    },
    long: {
      description: "3-4 sentences",
      wordCount: "30-60",
      charLimit: 280,
      prompt: "Create a detailed, engaging caption",
    },
  };

  const moods = [
    "Happy",
    "Sad",
    "Excited",
    "Peaceful",
    "Energetic",
    "Grateful",
    "Motivated",
    "Relaxed",
    "Confident",
    "Creative",
    "Nostalgic",
  ];

  const niches = [
    "Travel",
    "Fashion",
    "Food",
    "Fitness",
    "Technology",
    "Business",
    "Art",
    "Education",
    "Gaming",
    "Lifestyle",
    "Personal Development",
  ];

  const analyzeImage = async (imageFile) => {
    try {
      console.log("Starting image analysis for file:", imageFile.name);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const imageData = await readFileAsDataURL(imageFile);
      console.log("Image data read successfully");
      
      const result = await model.generateContent([
        "Analyze this image and describe its key elements, mood, and potential themes for a social media caption. Focus on visual elements, colors, composition, and emotional impact.",
        {
          inlineData: {
            data: imageData.split(",")[1],
            mimeType: imageFile.type,
          },
        },
      ]);
      console.log("Image analysis completed");
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Detailed error in analyzeImage:", error);
      if (error.message.includes("API key")) {
        throw new Error("API configuration error. Please contact support.");
      } else if (error.message.includes("image")) {
        throw new Error("Failed to process image. Please try a different image.");
      } else {
        throw new Error("Failed to analyze image: " + error.message);
      }
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateContent = async () => {
    setError("");
    if (
      !generationMethod ||
      (!selectedCategory && generationMethod !== "image") ||
      (generationMethod === "image" && !selectedImage)
    ) {
      setError("Please fill in all required fields!");
      return;
    }
    setLoading(true);

    try {
      let prompt = "";
      let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      if (generationMethod === "mood") {
        prompt = `Generate a ${captionLength} social media caption that expresses a ${selectedCategory.toLowerCase()} mood. 
        The caption should be engaging, authentic, and suitable for Instagram.
        Make it feel personal and relatable, using natural language and authentic expression.
        Consider using relevant emojis and line breaks for better readability.
        ${customInput ? `Include these elements: ${customInput}` : ""}
        Also suggest 5-7 relevant hashtags for this mood, considering current trends and engagement potential.`;
      } else if (generationMethod === "niche") {
        prompt = `Generate a ${captionLength} social media caption for the ${selectedCategory.toLowerCase()} niche. 
        The caption should be professional, engaging, and suitable for Instagram.
        Make it relevant to the ${selectedCategory.toLowerCase()} industry and audience, using appropriate terminology and references.
        Consider using relevant emojis and line breaks for better readability.
        ${customInput ? `Include these elements: ${customInput}` : ""}
        Also suggest 5-7 relevant hashtags for the ${selectedCategory.toLowerCase()} niche, focusing on industry-specific and trending tags.`;
      } else if (generationMethod === "image") {
        try {
          console.log("Starting image analysis...");
          const imageAnalysis = await analyzeImage(selectedImage);
          console.log("Image analysis completed:", imageAnalysis);
          
          prompt = `Based on this image analysis: "${imageAnalysis}"
          Generate a ${captionLength} social media caption that is engaging and authentic.
          The caption should be suitable for Instagram and feel personal and relatable.
          Make it feel personal and relatable, using natural language and authentic expression.
          Consider using relevant emojis and line breaks for better readability.
          ${customInput ? `Include these elements: ${customInput}` : ""}
          Also suggest 5-7 relevant hashtags for the image, considering the visual elements and potential reach.`;
        } catch (imageError) {
          console.error("Error during image analysis:", imageError);
          throw new Error("Failed to analyze image. Please try again with a different image.");
        }
      }

      console.log("Generating content with prompt:", prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("Generated content:", text);

      // Split the response into caption and hashtags
      const parts = text.split(/(?=#)/);
      const caption = parts[0].trim();
      const tags = parts.slice(1).map((tag) => tag.replace("#", "").trim());

      setCaption(caption);
      setHashtags(tags);
    } catch (error) {
      console.error("Error generating content:", error);
      if (error.message.includes("API key")) {
        setError("API configuration error. Please contact support.");
      } else if (error.message.includes("image")) {
        setError("Failed to process image. Please try a different image.");
      } else {
        setError("Failed to generate content. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = `${caption}\n\n${hashtags
        .map((tag) => `#${tag}`)
        .join(" ")}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedImage(null);
    setImagePreview(null);
    setCustomInput("");
    setCaption("");
    setHashtags([]);
    setError("");
  };

  useEffect(() => {
    if (isDropdownOpen && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isDropdownOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-main via-background-main/95 to-background-card py-6 sm:py-10 md:py-14 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 md:mb-14">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-main mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent-teal to-accent-teal">
            Try Hashly
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-primary-light max-w-2xl mx-auto leading-relaxed">
            Experience the power of AI-generated captions and hashtags.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50/50 backdrop-blur-sm border border-red-200 text-red-600 px-3 py-2 sm:px-4 sm:py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}

          {/* Generation Method Selection */}
          <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-sm border border-border-light/50">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-primary-main mb-4">
              Choose Generation Method
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: "mood",
                  icon: Heart,
                  label: "Mood",
                  description: "Based on mood",
                },
                {
                  id: "niche",
                  icon: BookOpen,
                  label: "Niche",
                  description: "Select niche",
                },
                {
                  id: "image",
                  icon: ImageIcon,
                  label: "Image",
                  description: "Upload image",
                },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    resetForm();
                    setGenerationMethod(id);
                  }}
                  className={`p-3 rounded-lg transition-all duration-300 text-center ${
                    generationMethod === id
                      ? "bg-accent-teal text-text-light shadow-md ring-2 ring-accent-teal/20"
                      : "bg-background-main/50 backdrop-blur-sm text-primary-main hover:bg-accent-teal/10"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                    <div className="text-xs sm:text-sm md:text-base font-medium capitalize">
                      {label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Caption Length Selection */}
          <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-sm border border-border-light/50">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-primary-main mb-4">
              Caption Length
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(lengthConfigs).map(
                ([key, { label, description }]) => (
                  <button
                    key={key}
                    onClick={() => setCaptionLength(key)}
                    className={`p-3 rounded-lg transition-all duration-300 text-left ${
                      captionLength === key
                        ? "bg-accent-teal text-text-light ring-2 ring-accent-teal/20"
                        : "bg-background-main/50 backdrop-blur-sm text-primary-main hover:bg-accent-teal/10"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-medium capitalize mb-1">
                      {label}
                    </div>
                    <div className="text-[10px] sm:text-xs opacity-80">
                      {description}
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Content Selection */}
          <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-sm border border-border-light/50">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-primary-main mb-4">
              {generationMethod === "image" ? "Upload Image" : "Select Content"}
            </h2>
            {generationMethod === "image" ? (
              <div className="space-y-4">
                <ImageUpload
                  onImageSelect={setSelectedImage}
                  onPreviewChange={setImagePreview}
                />
                {imagePreview && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-border-light/50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-background-main/80 backdrop-blur-sm rounded-full text-primary-main hover:bg-background-main"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  ref={dropdownButtonRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 rounded-lg bg-background-main/50 backdrop-blur-sm text-primary-main flex items-center justify-between hover:bg-accent-teal/10 transition-colors ring-1 ring-border-light/50"
                >
                  <span className="text-xs sm:text-sm font-medium capitalize">
                    {selectedCategory}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Custom Input */}
          <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-sm border border-border-light/50">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-primary-main mb-4">
              Additional Elements (Optional)
            </h2>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Add specific elements, keywords, or themes you'd like to include..."
              className="w-full h-24 sm:h-28 md:h-32 p-3 rounded-lg bg-background-main/50 backdrop-blur-sm border border-border-light/50 text-xs sm:text-sm text-primary-main placeholder-primary-light focus:outline-none focus:ring-2 focus:ring-accent-teal/50 transition-all resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium text-text-light transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-accent-teal/50 cursor-not-allowed"
                : "bg-gradient-to-r from-accent-teal to-accent-teal/90 hover:scale-[1.01] hover:shadow-md"
            }`}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm sm:text-base">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span className="text-sm sm:text-base">Generate Content</span>
              </>
            )}
          </button>

          {/* Generated Content */}
          {caption && (
            <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-sm border border-border-light/50 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-semibold text-primary-main">
                  Generated Content
                </h2>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg bg-background-main/50 backdrop-blur-sm text-primary-main hover:bg-accent-teal/10 transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="p-3 rounded-lg bg-background-main/50 backdrop-blur-sm">
                <p className="text-xs sm:text-sm md:text-base text-primary-main whitespace-pre-wrap">
                  {caption}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-accent-teal/10 text-primary-main text-xs sm:text-sm backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Portal */}
      {isDropdownOpen &&
        ReactDOM.createPortal(
          <div
            className="absolute z-[9999] bg-background-main/95 backdrop-blur-sm border border-border-light/50 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              position: "absolute",
            }}
          >
            {(generationMethod === "mood" ? moods : niches).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDropdownOpen(false);
                }}
                className={`w-full p-3 text-left hover:bg-accent-teal/10 transition-colors ${
                  selectedCategory === category
                    ? "bg-accent-teal text-text-light"
                    : "text-primary-main"
                }`}
              >
                <div className="text-xs sm:text-sm font-medium capitalize">
                  {category}
                </div>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default TryScreen;

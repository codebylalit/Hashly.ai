import React, { useState, useRef, useEffect, useCallback } from "react";
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

const INITIAL_CREDITS = 5;
const CREDITS_KEY = 'hashly_image_credits';

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
  const [credits, setCredits] = useState(() => {
    const stored = localStorage.getItem(CREDITS_KEY);
    return stored !== null ? parseInt(stored, 10) : INITIAL_CREDITS;
  });
  const [showOutOfCreditsModal, setShowOutOfCreditsModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Persist credits to localStorage
  useEffect(() => {
    localStorage.setItem(CREDITS_KEY, credits);
  }, [credits]);

  const lengthConfigs = {
    short: {
      description: "1-2 sentences",
      wordCount: "8-15",
      charLimit: 80,
      prompt: "Create a very brief and concise caption",
    },
    medium: {
      description: "2-3 sentences",
      wordCount: "15-25",
      charLimit: 150,
      prompt: "Create a balanced, medium-length caption",
    },
    long: {
      description: "3-4 sentences",
      wordCount: "25-35",
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
    // Validate file type and size
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image file.');
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error('Image size too large. Please upload an image smaller than 10MB.');
    }

    // Read image as base64
    let imageData;
    try {
      imageData = await readFileAsDataURL(imageFile);
    } catch (readError) {
      console.error('File read error:', readError);
      throw new Error('Failed to read image file. Please try a different image.');
    }
    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid image data. Please try a different image.');
    }

    // Analyze image with Gemini Vision
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        "Describe this image in detail, focusing on its key elements, mood, and themes for a social media caption.",
        {
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type,
          },
        },
      ]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      // Log the full error object for debugging
      console.error('Image analysis error:', error);
      if (error.message && error.message.includes('API key')) {
        throw new Error('API configuration error. Please contact support.');
      }
      if (error.message && (error.message.includes('file type') ||
        error.message.includes('size too large') ||
        error.message.includes('read image file'))) {
        throw error;
      }
      if (error.message && error.message.includes('INVALID_ARGUMENT')) {
        throw new Error('Invalid image format. Please try a different image.');
      }
      // Show the actual error message for debugging
      throw new Error('Failed to process image: ' + (error.message || error.toString()));
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
    if (generationMethod === "image") {
      if (credits <= 0) {
        setShowOutOfCreditsModal(true); // Show popup
        return;
      }
      // Deduct credit immediately
      setCredits((c) => Math.max(0, c - 1));
    }
    setLoading(true);

    try {
      let prompt = "";
      let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      if (generationMethod === "image") {
        // 1. Analyze the image
        const imageAnalysis = await analyzeImage(selectedImage);
        // 2. Use the analysis to generate a caption
        prompt = `\nBased on this image description: "${imageAnalysis}"
Write a ${captionLength} Instagram caption that is engaging, authentic, and relevant to the image.\nUse natural language, include relevant emojis and line breaks for readability.\n${customInput ? `Include these elements: ${customInput}` : ""}\nAlso suggest 5-7 relevant hashtags for the image.\nFormat output as:\nCaption: <your caption>\nHashtags: #tag1 #tag2 #tag3 #tag4 #tag5\n`;
      } else if (generationMethod === "mood") {
        prompt = `Generate a ${captionLength} social media caption that expresses a ${selectedCategory.toLowerCase()} mood. \nThe caption should be engaging, authentic, and suitable for Instagram.\nMake it feel personal and relatable, using natural language and authentic expression.\nConsider using relevant emojis and line breaks for better readability.\n${customInput ? `Include these elements: ${customInput}` : ""}\nAlso suggest 5-7 relevant hashtags for this mood, considering current trends and engagement potential.`;
      } else if (generationMethod === "niche") {
        prompt = `Generate a ${captionLength} social media caption for the ${selectedCategory.toLowerCase()} niche. \nThe caption should be professional, engaging, and suitable for Instagram.\nMake it relevant to the ${selectedCategory.toLowerCase()} industry and audience, using appropriate terminology and references.\nConsider using relevant emojis and line breaks for better readability.\n${customInput ? `Include these elements: ${customInput}` : ""}\nAlso suggest 5-7 relevant hashtags for the ${selectedCategory.toLowerCase()} niche, focusing on industry-specific and trending tags.`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the output for caption and hashtags
      let captionParsed = text.trim();
      let hashtagsParsed = [];
      const captionMatch = text.match(/Caption:\s*([\s\S]*?)\nHashtags:/i);
      const hashtagsMatch = text.match(/Hashtags:\s*([#\w\s]+)/i);
      if (captionMatch) {
        captionParsed = captionMatch[1].trim();
      }
      if (hashtagsMatch) {
        hashtagsParsed = hashtagsMatch[1]
          .split("#")
          .map((tag) => tag.trim())
          .filter(Boolean);
      } else {
        // fallback: try to extract hashtags from the text
        const fallbackTags = text.match(/#\w+/g);
        if (fallbackTags) {
          hashtagsParsed = fallbackTags.map((tag) => tag.replace("#", ""));
        }
      }

      setCaption(captionParsed);
      setHashtags(hashtagsParsed);
    } catch (error) {
      setError(error.message || "Failed to generate content. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-b from-background-main via-background-main/95 to-background-card py-4 sm:py-6 md:py-10 px-2 sm:px-4 md:px-8">
      {/* Removed Test Watch Ad Button */}
      <div className="max-w-4xl mx-auto pb-24 sm:pb-0">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-10">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-primary-main mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent-teal to-accent-teal">
            Try Hashly
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-primary-light max-w-2xl mx-auto leading-relaxed">
            Experience the power of AI-generated captions and hashtags.
          </p>
          {/* Show credits for image-based generation */}
          <div className="mt-2 text-xs sm:text-sm text-primary-main font-semibold">
            Image Credits: {credits}
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4 md:space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50/50 backdrop-blur-sm border border-red-200 text-red-600 px-3 py-2 sm:px-4 sm:py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}
          {/* Generation Method Selection */}
          <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-border-light/50">
            <h2 className="text-xs sm:text-base md:text-lg font-semibold text-primary-main mb-2 sm:mb-4">
              Choose Generation Method
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
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
                  className={`p-3 sm:p-4 rounded-lg min-h-[48px] transition-all duration-300 text-center ${generationMethod === id
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
          <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-border-light/50">
            <h2 className="text-xs sm:text-base md:text-lg font-semibold text-primary-main mb-2 sm:mb-4">
              Caption Length
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {Object.entries(lengthConfigs).map(
                ([key, { label, description }]) => (
                  <button
                    key={key}
                    onClick={() => setCaptionLength(key)}
                    className={`p-3 sm:p-4 rounded-lg min-h-[48px] transition-all duration-300 text-left ${captionLength === key
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
          <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-border-light/50">
            <h2 className="text-xs sm:text-base md:text-lg font-semibold text-primary-main mb-2 sm:mb-4">
              {generationMethod === "image" ? "Upload Image" : "Select Content"}
            </h2>
            {generationMethod === "image" ? (
              <div className="space-y-3 sm:space-y-4">
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
                  className="w-full p-3 sm:p-4 rounded-lg min-h-[48px] bg-background-main/50 backdrop-blur-sm text-primary-main flex items-center justify-between hover:bg-accent-teal/10 transition-colors ring-1 ring-border-light/50"
                >
                  <span className="text-xs sm:text-sm font-medium capitalize">
                    {selectedCategory}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>
            )}
          </div>
          {/* Collapsible Advanced Options */}
          <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-border-light/50">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h2 className="text-xs sm:text-base md:text-lg font-semibold text-primary-main">
                Additional Elements (Optional)
              </h2>
              <button
                className="text-accent-teal text-xs sm:text-sm"
                onClick={() => setShowAdvanced((v) => !v)}
              >
                {showAdvanced ? 'Hide' : 'Show'}
              </button>
            </div>
            {showAdvanced && (
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Add specific elements, keywords, or themes you'd like to include..."
                className="w-full h-20 sm:h-24 md:h-32 p-3 rounded-lg bg-background-main/50 backdrop-blur-sm border border-border-light/50 text-xs sm:text-sm text-primary-main placeholder-primary-light focus:outline-none focus:ring-2 focus:ring-accent-teal/50 transition-all resize-none"
              />
            )}
          </div>
          {/* Generated Content */}
          {caption && (
            <div className="bg-background-card/80 backdrop-blur-sm rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-border-light/50 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs sm:text-base font-semibold text-primary-main">
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
      {/* Sticky Generate Button for Mobile */}
      <div className="fixed bottom-0 left-0 w-full z-50 sm:static sm:w-auto bg-background-main/90 sm:bg-transparent px-2 py-2 sm:p-0">
        <button
          onClick={generateContent}
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium text-text-light transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-accent-teal to-accent-teal/90 hover:scale-[1.01] hover:shadow-md"
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
                className={`w-full p-3 sm:p-4 text-left hover:bg-accent-teal/10 transition-colors ${selectedCategory === category
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
      {/* Out of Credits Modal: Show Download App Prompt */}
      {showOutOfCreditsModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full text-center">
            <div className="mb-4 text-lg font-semibold text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Out of Image Credits
            </div>
            <div className="mb-4 text-primary-main">
              You are out of image credits.<br />
              Download our app for unlimited access!
            </div>
            <a
              className="w-full py-2 rounded-lg bg-accent-teal text-white font-medium mt-2 block"
              href="https://play.google.com/store/apps/details?id=com.caps.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download App
            </a>
            <button
              className="w-full py-2 rounded-lg bg-gray-200 text-primary-main font-medium mt-2"
              onClick={() => setShowOutOfCreditsModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryScreen;

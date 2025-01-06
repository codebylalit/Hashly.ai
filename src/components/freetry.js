import React, { useState } from "react";
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
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ImageUpload from "./imgupload";



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
  const [freeTrialsRemaining, setFreeTrialsRemaining] = useState(5);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

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

  const genAI = new GoogleGenerativeAI(
    "AIzaSyCK3_EjIpgEJ5QXwT0tkyFGfEZvixYLBM8"
  );

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

  const generateHashtags = async (content) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(
        `Generate ${
          captionLength === "short" ? "5" : "10"
        } relevant, trendy hashtags for: ${content}. 
         Focus on engagement and discoverability. Return only hashtags separated by spaces, without # symbol.`
      );
      return result.response
        .text()
        .split(" ")
        .filter((tag) => tag.length > 0);
    } catch (error) {
      console.error("Error generating hashtags:", error);
      setError("Failed to generate hashtags. Please try again.");
      return [];
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

  const generateContent = async () => {
    if (freeTrialsRemaining === 0) {
      setShowLoginDialog(true);
      return;
    }

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
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const lengthConfig = lengthConfigs[captionLength];
      const customPrompt = customInput
        ? ` Consider this context: ${customInput}.`
        : "";

      let prompt = `${lengthConfig.prompt} (${lengthConfig.wordCount} words) for Instagram that is engaging and authentic.`;

      switch (generationMethod) {
        case "mood":
          prompt += ` Express a ${selectedCategory} mood and emotion.${customPrompt}`;
          break;
        case "niche":
          prompt += ` Create content for the ${selectedCategory} niche.${customPrompt}`;
          break;
        case "image":
          const imageContext = selectedImage.type.includes("image/")
            ? `an image of type ${selectedImage.type}`
            : selectedImage.name;
          prompt += ` Create a caption for ${imageContext}.${customPrompt}`;
          break;
      }

      const result = await model.generateContent(prompt);
      const generatedCaption = result.response.text();
      const generatedHashtags = await generateHashtags(generatedCaption);

      setCaption(generatedCaption);
      setHashtags(generatedHashtags);
      setFreeTrialsRemaining((prev) => prev - 1);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Refined header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Caption Generator
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">
              {freeTrialsRemaining} free generations remaining
            </span>
            <button
              onClick={() => (window.location.href = "/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              <span className="font-medium">Login</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Refined error alert */}
          {error && (
            <div className="bg-white shadow-sm border-l-4 border-red-500 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          )}
          {showLoginDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                <button
                  onClick={() => setShowLoginDialog(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="text-center">
                  <div className="flex flex-col items-center justify-center mb-6">
                    <Sparkles className="h-12 w-12 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Continue Generating Captions
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      You've used all your free generations. Login or sign up to
                      continue creating engaging captions!
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => (window.location.href = "/login")}
                      className="w-full px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-purple-500 text-white hover:bg-purple-600"
                    >
                      <LogIn className="h-4 w-4" />
                      Login to Your Account
                    </button>
                    <button
                      onClick={() => (window.location.href = "/signup")}
                      className="w-full px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Create New Account
                    </button>
                  </div>
                  <button
                    onClick={() => setShowLoginDialog(false)}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Refined generation method buttons */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "mood", icon: Heart, label: "Mood" },
              { id: "niche", icon: BookOpen, label: "Niche" },
              { id: "image", icon: ImageIcon, label: "Image" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  resetForm();
                  setGenerationMethod(id);
                }}
                className={`p-3 rounded-lg transition-all flex flex-col items-center ${
                  generationMethod === id
                    ? "bg-purple-500 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {generationMethod && (
            <div className="space-y-4">
              {/* Refined length selector */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(lengthConfigs).map(([length, config]) => (
                  <button
                    key={length}
                    onClick={() => setCaptionLength(length)}
                    className={`p-2 rounded-lg transition-all ${
                      captionLength === length
                        ? "bg-purple-50 text-purple-600"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">
                      {length}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {config.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Refined select/upload area */}
              {generationMethod === "mood" || generationMethod === "niche" ? (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white text-sm text-gray-600 outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Select {generationMethod}</option>
                  {(generationMethod === "mood" ? moods : niches).map(
                    (item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <ImageUpload
                    onUpload={(file, preview) => {
                      setSelectedImage(file);
                      setImagePreview(preview);
                    }}
                    selectedImage={selectedImage}
                  />
                </div>
              )}

              {/* Refined input */}
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Add custom context or keywords (optional)"
                className="w-full px-3 py-2 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-purple-400"
              />

              {/* Refined textarea area */}
              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Your caption will appear here..."
                  className="w-full h-24 px-3 py-3 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
                {caption && (
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-100 transition-all"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>

              {/* Refined hashtags */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-2 rounded-full bg-purple-50 text-purple-600 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Refined generate button */}
              <button
                onClick={generateContent}
                disabled={loading}
                className="w-full px-3 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">Generate Caption</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryScreen;

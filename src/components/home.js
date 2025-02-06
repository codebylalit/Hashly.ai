import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Loader,
  Image as ImageIcon,
  BookOpen,
  Heart,
  AlertCircle,
  Copy,
  Check,
  Lock,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Auth, { AuthProvider } from "./auth";

import { useSupabase } from "./supabase";
import ImageUpload from "./imgupload";

const CaptionGenerator = () => {
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
  const { user, loading: authLoading } = AuthProvider({ children: null });

  const [usageCount, setUsageCount] = useState({ text: 0, image: 0 });
  const [isPremium, setIsPremium] = useState(false);

  const {
    saveCaptionHistory,
    trackAnalytics,
    getUserSubscription,
    updateUserUsage,
  } = useSupabase();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    const subscription = await getUserSubscription(user.id);
    setIsPremium(subscription.isPremium);
    setUsageCount(subscription.usage || { text: 0, image: 0 });
  };

  const checkUsageLimits = () => {
    if (isPremium) return true;

    if (generationMethod === "image") {
      if (usageCount.image >= 2) {
        setError(
          "You've reached the limit for image captions. Upgrade to premium for unlimited access!"
        );
        return false;
      }
    } else {
      if (usageCount.text >= 10) {
        setError(
          "You've reached the limit for text captions. Upgrade to premium for unlimited access!"
        );
        return false;
      }
    }
    return true;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return <Auth onAuth={(user) => console.log("Authenticated:", user)} />;
  }

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
    setError("");
    if (!checkUsageLimits()) return;

    if (
      !generationMethod ||
      (!selectedCategory && generationMethod !== "image") ||
      (generationMethod === "image" && !selectedImage)
    ) {
      setError("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    let trimmedCaption = "";
    let generatedHashtags = [];

    try {
      await trackAnalytics(generationMethod, selectedCategory);

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const lengthConfig = lengthConfigs[captionLength];
      const customPrompt = customInput
        ? ` Consider this context: ${customInput}.`
        : "";
      let prompt = `${lengthConfig.prompt} (${lengthConfig.wordCount} words) for Instagram that is engaging and authentic.`;

      switch (generationMethod) {
        case "mood":
          prompt += ` Express a ${selectedCategory} mood and emotion.${customPrompt} 
                Make it conversational and relatable. Include emojis naturally but not excessively. 
                Maintain a ${selectedCategory} tone throughout. Use relevant metaphors and expressions.
                Stay within ${lengthConfig.charLimit} characters.`;
          break;
        case "niche":
          prompt += ` Create content for the ${selectedCategory} niche.${customPrompt} 
                Include valuable insights and industry-specific knowledge.
                Add relevant emojis and maintain professional yet engaging tone.
                Use niche-specific terminology appropriately.
                Stay within ${lengthConfig.charLimit} characters.`;
          break;
        case "image":
          const imageContext = selectedImage.type.includes("image/")
            ? `an image of type ${selectedImage.type}`
            : selectedImage.name;
          prompt += ` Create a caption for ${imageContext}.${customPrompt} 
                Focus on visual elements and create a story around the image.
                Make it visually descriptive and engaging. Include fitting emojis.
                Emphasize the key elements in the image.
                Stay within ${lengthConfig.charLimit} characters.`;
          break;
        default:
          break;
      }

      const result = await model.generateContent(prompt);
      if (!result || !result.response) {
        throw new Error("No response from content generation");
      }

      const generatedCaption = result.response.text();
      trimmedCaption = generatedCaption;

      if (trimmedCaption.length > lengthConfig.charLimit) {
        trimmedCaption = generatedCaption.substring(0, lengthConfig.charLimit);
        const lastPeriod = trimmedCaption.lastIndexOf(".");
        if (lastPeriod > 0) {
          trimmedCaption = trimmedCaption.substring(0, lastPeriod + 1);
        }
      }

      // Only proceed with hashtags and state updates if we have a caption
      if (trimmedCaption) {
        generatedHashtags = await generateHashtags(trimmedCaption);

        await saveCaptionHistory(
          trimmedCaption,
          generatedHashtags,
          generationMethod,
          selectedCategory
        );

        setCaption(trimmedCaption);
        setHashtags(generatedHashtags);

        const updatedUsage = {
          text: usageCount.text + (generationMethod !== "image" ? 1 : 0),
          image: usageCount.image + (generationMethod === "image" ? 1 : 0),
        };

        await updateUserUsage(user.id, updatedUsage);
        setUsageCount(updatedUsage);
      } else {
        throw new Error("Generated caption is empty");
      }
    } catch (error) {
      console.error("Error:", error);
      // Only set error if caption generation failed
      if (!trimmedCaption) {
        if (error.message?.includes("quota")) {
          setError("API quota exceeded. Please try again later.");
        } else if (error.message?.includes("network")) {
          setError(
            "Network error. Please check your connection and try again."
          );
        } else if (error.message?.includes("permission")) {
          setError("Authentication error. Please sign in again.");
        } else {
          setError("Failed to generate content. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return <Auth onAuth={(user) => console.log("Authenticated:", user)} />;
  }

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedImage(null);
    setImagePreview(null);
    setCustomInput("");
    setCaption("");
    setHashtags([]);
    setError("");
  };
  const renderUsageStatus = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">
            {isPremium ? "Premium User" : "Free User"}
          </p>
          {!isPremium && (
            <div className="text-xs text-gray-500">
              <p>Text captions: {usageCount.text}/10</p>
              <p>Image captions: {usageCount.image}/2</p>
            </div>
          )}
        </div>
        {!isPremium && (
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm flex items-center gap-2"
            onClick={() => {
              /* Add your subscription logic */
            }}
          >
            <Lock className="h-4 w-4" />
            Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      <h2 className="text-xl font-medium text-gray-900">Caption Generator</h2>
      <div className="max-w-full mx-auto py-8 px-4">
        {renderUsageStatus()}
        <div className="space-y-4">
          {error && (
            <div className="bg-white border-l-4 border-red-500 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-xs text-gray-600">{error}</p>
              </div>
            </div>
          )}

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
                className={`p-4 rounded-lg transition-all flex flex-col items-center ${
                  generationMethod === id
                    ? "bg-purple-500 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>

          {generationMethod && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(lengthConfigs).map(([length, config]) => (
                  <button
                    key={length}
                    onClick={() => setCaptionLength(length)}
                    className={`p-4 rounded-lg transition-all ${
                      captionLength === length
                        ? "bg-purple-50 text-purple-600"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-xs font-medium capitalize">
                      {length}
                    </div>
                    <div className="text-xs text-gray-400">
                      {config.description}
                    </div>
                  </button>
                ))}
              </div>

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
                <ImageUpload
                  onUpload={(file, preview) => {
                    setSelectedImage(file);
                    setImagePreview(preview);
                  }}
                  selectedImage={selectedImage}
                />
              )}

              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Add custom context or keywords (optional)"
                className="w-full px-3 py-2 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-purple-400"
              />

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
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </button>
                )}
              </div>

              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
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

              <button
                onClick={generateContent}
                disabled={loading}
                className="w-full px-3 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                <span className="text-sm font-medium">Generate</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptionGenerator;

import React from "react";
import { motion } from "framer-motion";
import { Cat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Image-based Captions",
    description:
      "Upload your image and get AI-generated captions that perfectly describe your content.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Mood-based Generation",
    description:
      "Select from various moods to generate captions that match your emotional tone.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    title: "Smart Hashtags",
    description:
      "Get relevant, trending hashtags automatically generated for your content.",
  },
];

const steps = [
  {
    title: "Choose Your Method",
    description:
      "Select from mood-based, niche-specific, or image-based caption generation.",
  },
  {
    title: "Customize Options",
    description:
      "Set caption length, add custom context, and select specific categories.",
  },
  {
    title: "Generate & Save",
    description:
      "Get your AI-generated caption with matching hashtags and save to your history.",
  },
];

const footerColumns = [
  { title: "Product", links: ["Features", "Pricing", "API"] },
  { title: "Company", links: ["About", "Blog", "Careers"] },
  { title: "Support", links: ["Help Center", "Contact", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security"] },
];

const Landing = () => {
    const navigate = useNavigate();


    
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-1">
              <Cat className="h-7 w-7 text-purple-500" />
              <span className="text-xl font-light tracking-tight text-purple-800">
                caps.ai
              </span>
            </div>

            <div className="space-x-8">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-purple-800 transition-colors duration-300"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-sm px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-800 transition-all duration-300 ease-in-out"
              >
                Start free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-light tracking-tight text-purple-800"
          >
            Generate perfect captions
            <span className="block mt-2 text-purple-400">powered by AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-gray-500 text-lg"
          >
            Create engaging social media captions in seconds. Upload an image or
            choose your style.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            <a
              href="#"
              className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-800 transition-all duration-300 ease-in-out"
              onClick={() => navigate("/try")}
            >
              Try it free
            </a>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-purple-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-12 w-12 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-purple-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-light text-purple-800 text-center mb-16">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-12 h-12 rounded-full border border-purple-300 flex items-center justify-center mx-auto mb-6 group-hover:border-purple-500 transition-colors duration-300">
                  <span className="text-sm text-purple-600">{index + 1}</span>
                </div>
                <h3 className="text-lg font-medium text-purple-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-light mb-6">
              Start creating perfect captions
            </h2>
            <p className="text-purple-200 mb-8">
              Join thousands of content creators who trust caps.ai
            </p>
            <a
              href="#"
              onClick={() => navigate("/signup")}
              className="px-8 py-3 bg-white text-purple-800 rounded-full hover:bg-gray-100 transition-all duration-300 ease-in-out inline-block"
            >
              Get started free
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerColumns.map((column, index) => (
              <div key={index}>
                <h3 className="text-sm font-medium text-purple-800 mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-purple-800 transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              © 2025 caps.ai All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
import React from 'react';

const About = () => (
  <div className="min-h-screen bg-background-main py-12 px-4">
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary-main text-center">About Hashly.ai</h1>
      <p className="text-lg text-text-secondary text-center mb-6">
        Hashly.ai is your AI-powered companion for crafting engaging social media content. Our platform helps creators generate captivating captions and trending hashtags, making it easy to boost your online presence and connect with your audience. Whether you're a business, influencer, or casual user, Hashly.ai streamlines your content creation process with smart, user-friendly tools.
      </p>
      <h2 className="text-xl font-semibold text-primary-main mb-2 text-center">Our Mission</h2>
      <p className="text-base text-text-secondary text-center mb-6">
        Our mission is to empower everyone to express themselves creatively and effectively on social media. We believe that great content should be accessible to all, regardless of experience or background.
      </p>
      <h2 className="text-xl font-semibold text-primary-main mb-2 text-center">Key Features</h2>
      <ul className="text-base text-text-secondary mb-6 list-disc list-inside mx-auto max-w-md">
        <li>AI-powered caption and hashtag generation</li>
        <li>Support for multiple social platforms</li>
        <li>Customizable content styles to match your brand</li>
        <li>Fast, intuitive, and user-friendly interface</li>
        <li>Privacy-focused: your data is never sold or misused</li>
      </ul>
      <h2 className="text-xl font-semibold text-primary-main mb-2 text-center">Our Values</h2>
      <p className="text-base text-text-secondary text-center mb-6">
        We value creativity, simplicity, and trust. Our team is dedicated to building tools that help you shine online while keeping your privacy and experience at the forefront.
      </p>
      <h2 className="text-xl font-semibold text-primary-main mb-2 text-center">Image-Based Caption Generation</h2>
      <p className="text-base text-text-secondary text-center mb-6">
        Hashly.ai can generate creative captions and hashtags not just from text, but also from your images! Simply upload a photo, and our AI will analyze its content, mood, and context to suggest the perfect caption and relevant hashtags. This makes it easier than ever to share visually engaging posts with captions that truly match your images.
      </p>
      <h2 className="text-xl font-semibold text-primary-main mb-2 text-center">Get in Touch</h2>
      <p className="text-base text-text-secondary text-center">
        Have questions, feedback, or ideas? We'd love to hear from you! Visit our <a href="/contact" className="text-accent-teal underline">Contact</a> page or email us at <a href="mailto:visonovaofficial@gmail.com" className="text-accent-teal underline">visonovaofficial@gmail.com</a>.
      </p>
    </div>
  </div>
);

export default About; 
import React, { useState } from 'react';
import { Calendar, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "How to Create Engaging Social Media Content with AI",
    excerpt: "Learn how to leverage AI tools to create compelling social media content that resonates with your audience and drives engagement.",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Content Creation",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 2,
    title: "The Power of Hashtags in 2024: A Complete Guide",
    excerpt: "Discover the latest trends in hashtag usage and learn how to effectively use them to increase your social media reach and engagement.",
    date: "March 10, 2024",
    readTime: "7 min read",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 3,
    title: "AI Writing Tools: Revolutionizing Content Creation",
    excerpt: "Explore how AI writing tools are transforming the way we create content and what this means for content creators and marketers.",
    date: "March 5, 2024",
    readTime: "6 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 4,
    title: "10 Instagram Caption Ideas That Drive Engagement",
    excerpt: "Discover creative caption ideas that will make your Instagram posts stand out and encourage more interaction from your followers.",
    date: "March 1, 2024",
    readTime: "8 min read",
    category: "Instagram",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 5,
    title: "The Future of Social Media Marketing: AI Trends to Watch",
    excerpt: "Stay ahead of the curve with these emerging AI trends that are shaping the future of social media marketing.",
    date: "February 25, 2024",
    readTime: "6 min read",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 6,
    title: "How to Build a Personal Brand on Social Media",
    excerpt: "Learn the essential steps to create and maintain a strong personal brand that resonates with your target audience.",
    date: "February 20, 2024",
    readTime: "7 min read",
    category: "Personal Branding",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 7,
    title: "Content Calendar: The Ultimate Guide for 2024",
    excerpt: "Master the art of content planning with our comprehensive guide to creating and maintaining an effective content calendar.",
    date: "February 15, 2024",
    readTime: "9 min read",
    category: "Content Strategy",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 8,
    title: "Social Media Analytics: Understanding Your Metrics",
    excerpt: "Dive deep into social media analytics and learn how to interpret key metrics to improve your content strategy.",
    date: "February 10, 2024",
    readTime: "6 min read",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 9,
    title: "The Psychology of Viral Content",
    excerpt: "Understand the psychological triggers that make content go viral and how to incorporate them into your strategy.",
    date: "February 5, 2024",
    readTime: "8 min read",
    category: "Content Psychology",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 10,
    title: "AI-Powered Social Media Tools: A Comprehensive Review",
    excerpt: "Compare and contrast the top AI tools for social media management and content creation in 2024.",
    date: "February 1, 2024",
    readTime: "10 min read",
    category: "Tools & Reviews",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  }
];

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-background-main py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-main mb-4">Hashly Blog</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Insights, tips, and guides to help you create better social media content
            and grow your online presence.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-background-card rounded-xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-accent-teal/10 text-accent-teal rounded-full text-sm">
                    {blogPosts[0].category}
                  </span>
                  <div className="flex items-center text-text-secondary text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {blogPosts[0].date}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-primary-main mb-3">
                  {blogPosts[0].title}
                </h2>
                <p className="text-text-secondary mb-4">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center text-text-secondary text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {blogPosts[0].readTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentPosts.map((post) => (
            <article
              key={post.id}
              className="bg-background-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-accent-teal/10 text-accent-teal rounded-full text-sm">
                    {post.category}
                  </span>
                  <div className="flex items-center text-text-secondary text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary-main mb-3">
                  {post.title}
                </h3>
                <p className="text-text-secondary mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-text-secondary text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mb-16">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'text-text-secondary/50 cursor-not-allowed'
                : 'text-primary-main hover:bg-accent-teal/10'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`w-8 h-8 rounded-lg ${
                currentPage === index + 1
                  ? 'bg-accent-teal text-text-light'
                  : 'text-primary-main hover:bg-accent-teal/10'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? 'text-text-secondary/50 cursor-not-allowed'
                : 'text-primary-main hover:bg-accent-teal/10'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-background-card rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-main mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Get the latest tips, guides, and insights on social media content creation
            delivered straight to your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border-light bg-background-main text-primary-main focus:outline-none focus:ring-2 focus:ring-accent-teal"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-accent-teal text-text-light rounded-lg font-medium hover:bg-accent-orange transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Blog; 
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    navigate('/404');
    return null;
  }

  // Function to transform content into React components with improved styling
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Handle CTA Buttons
      if (line.includes('[CTA Button:')) {
        const buttonText = line.match(/"([^"]+)"/)?.[1] || 'Get Started';
        return (
          <div key={index} className="my-12 flex justify-center">
            <Button 
              size="lg"
              className="bg-gold hover:bg-gold-light text-space px-8 py-6 text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={() => navigate('/assessment')}
            >
              {buttonText}
            </Button>
          </div>
        );
      }
      
      // Handle Section Headers (previously marked with ##)
      if (line.trim().startsWith('##')) {
        return (
          <h2 
            key={index} 
            className="text-2xl font-bold mt-12 mb-6 text-gold"
          >
            {line.replace(/##/g, '').trim()}
          </h2>
        );
      }

      // Handle Main Headers (previously marked with #)
      if (line.trim().startsWith('#')) {
        return (
          <h1 
            key={index} 
            className="text-3xl font-bold mt-12 mb-6 text-gold"
          >
            {line.replace(/#/g, '').trim()}
          </h1>
        );
      }
      
      // Handle Lists
      if (line.trim().startsWith('-')) {
        return (
          <li 
            key={index} 
            className="ml-6 mb-3 text-gray-300 list-disc"
          >
            {line.replace(/-/, '').trim()}
          </li>
        );
      }

      // Handle Numbered Lists
      if (line.match(/^\d+\./)) {
        return (
          <li 
            key={index} 
            className="ml-6 mb-3 text-gray-300 list-decimal"
          >
            {line.replace(/^\d+\./, '').trim()}
          </li>
        );
      }
      
      // Handle Empty Lines
      if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }
      
      // Default paragraph handling with improved readability
      return (
        <p 
          key={index} 
          className="mb-6 text-gray-300 leading-relaxed text-lg"
        >
          {line}
        </p>
      );
    });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Ad Astra Process Optimus</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta name="keywords" content={post.tags.join(', ')} />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Button 
          onClick={() => navigate('/blog')} 
          variant="outline"
          className="mb-8 text-gold hover:text-gold-light"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Button>
        
        <article className="prose prose-invert max-w-none">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg mb-8"
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gold font-medium">{post.category}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{post.date}</span>
            </div>
            <span className="text-gray-400">{post.readTime}</span>
          </div>

          <h1 className="text-4xl font-bold mb-8 text-gold">{post.title}</h1>
          
          <div className="markdown-content space-y-4">
            {renderContent(post.content)}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-space-light px-4 py-2 rounded-full text-sm text-gold border border-gold/20 hover:border-gold/40 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    navigate('/404');
    return null;
  }

  // Function to transform CTA text and markdown content into React components
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Handle CTA Buttons
      if (line.includes('[CTA Button:')) {
        const buttonText = line.match(/"([^"]+)"/)?.[1] || 'Get Started';
        return (
          <div key={index} className="my-8 flex justify-center">
            <Button 
              size="lg"
              className="bg-gold hover:bg-gold-light text-space px-8 py-6 text-lg"
              onClick={() => navigate('/assessment')}
            >
              {buttonText}
            </Button>
          </div>
        );
      }
      
      // Handle Headers
      if (line.startsWith('##')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.replace('##', '').trim()}</h2>;
      }
      if (line.startsWith('#')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.replace('#', '').trim()}</h1>;
      }
      
      // Handle Lists
      if (line.startsWith('-')) {
        return <li key={index} className="ml-4 mb-2">{line.replace('-', '').trim()}</li>;
      }
      
      // Handle Empty Lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Default paragraph handling
      return <p key={index} className="mb-4">{line}</p>;
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Button 
        onClick={() => navigate('/blog')} 
        variant="outline"
        className="mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
      </Button>
      
      <article className="prose prose-invert max-w-none">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-gold">{post.category}</span>
            <span className="mx-2">•</span>
            <span className="text-gray-400">{post.date}</span>
          </div>
          <span className="text-gray-400">{post.readTime}</span>
        </div>

        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        
        <div className="markdown-content">
          {renderContent(post.content)}
        </div>
        
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
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
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => navigate('/blog')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </div>
      </div>
    );
  }

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
        
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        
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
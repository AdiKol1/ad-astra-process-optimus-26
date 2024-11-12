import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="overflow-hidden bg-space-light border-gold/20 h-full flex flex-col">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gold text-sm">{post.category}</span>
          <span className="text-gray-400 text-sm">{post.date}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-300 mb-4 flex-1">{post.excerpt}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-400">{post.readTime}</span>
          <Button 
            variant="link" 
            className="text-gold hover:text-gold-light p-0"
            asChild
          >
            <Link to={`/blog/${post.slug}`}>
              Read More <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
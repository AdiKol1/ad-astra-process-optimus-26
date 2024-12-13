import React from 'react';
import { blogPosts } from '@/data/blog-posts';
import BlogCard from '@/components/features/blog/BlogCard';

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Latest Insights</h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest trends in AI and process automation
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
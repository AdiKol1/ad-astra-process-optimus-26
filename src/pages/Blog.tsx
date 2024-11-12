import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blog-posts';
import BlogCard from '@/components/blog/BlogCard';

const Blog = () => {
  const { data: posts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => blogPosts,
    initialData: blogPosts,
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Latest Insights</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest trends and strategies in AI-powered marketing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="bg-space-light p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-6">Get the latest AI marketing insights delivered to your inbox</p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-space border border-gold/20 text-white"
            />
            <Button className="bg-gold hover:bg-gold-light text-space">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
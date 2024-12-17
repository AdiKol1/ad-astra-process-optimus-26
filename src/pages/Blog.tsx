import React from 'react';
import { blogPosts } from '@/data/blog-posts';
import BlogCard from '@/components/features/blog/BlogCard';
import { Helmet } from 'react-helmet-async';

const Blog = () => {
  // Add console log to help debug
  console.log('Available blog posts:', blogPosts);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog | Ad Astra Process Optimus</title>
        <meta 
          name="description" 
          content="Stay updated with the latest trends in AI and process automation" 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Latest Insights</h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest trends in AI and process automation
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No blog posts available at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
import React from 'react';
import { blogPosts } from '@/data/blog-posts';
import BlogCard from '@/components/features/blog/BlogCard';
import { Helmet } from 'react-helmet-async';

const Blog: React.FC = () => {
  console.log('Blog component rendering');
  console.log('Available blog posts:', blogPosts);

  return (
    <>
      <Helmet>
        <title>Blog - Ad Astra Process Optimus</title>
        <meta name="description" content="Latest insights and updates on process automation and digital transformation" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Our Blog</h1>
        <p className="text-lg mb-4">
          Stay updated with the latest insights in process automation and digital transformation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
  );
};

export default Blog;
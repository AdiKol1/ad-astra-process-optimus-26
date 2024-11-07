import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    title: "The Future of AI in Digital Marketing",
    excerpt: "Discover how artificial intelligence is revolutionizing the digital marketing landscape and what it means for your business.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    date: "March 15, 2024"
  },
  {
    title: "5 AI-Powered Marketing Strategies for 2024",
    excerpt: "Learn about the most effective AI marketing strategies that are driving results for businesses this year.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    date: "March 10, 2024"
  }
];

const Blog = () => {
  return (
    <section className="py-20 px-4" id="blog">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Latest Insights</h2>
          <p className="text-xl text-gray-300">Stay updated with the latest trends in AI marketing</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden bg-space-light">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-gold mb-2">{post.date}</p>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <Button variant="link" className="text-gold hover:text-gold-light p-0">
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
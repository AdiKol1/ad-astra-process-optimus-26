import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Blog = () => {
  const { toast } = useToast();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      // Simulated API call - replace with actual API endpoint
      return [
        {
          id: 1,
          title: "The Future of AI in Digital Marketing",
          excerpt: "Discover how artificial intelligence is revolutionizing the digital marketing landscape and what it means for your business.",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
          date: "March 15, 2024",
          category: "AI Trends"
        },
        {
          id: 2,
          title: "5 AI-Powered Marketing Strategies for 2024",
          excerpt: "Learn about the most effective AI marketing strategies that are driving results for businesses this year.",
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
          date: "March 10, 2024",
          category: "Strategy"
        },
        {
          id: 3,
          title: "Maximizing ROI with AI Marketing Tools",
          excerpt: "A comprehensive guide to measuring and optimizing your marketing ROI using artificial intelligence.",
          image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
          date: "March 5, 2024",
          category: "ROI"
        }
      ];
    }
  });

  const handleSubscribe = () => {
    toast({
      title: "Newsletter Subscription",
      description: "Thank you for subscribing to our newsletter!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

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
          {posts?.map((post) => (
            <Card key={post.id} className="overflow-hidden bg-space-light border-gold/20">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gold text-sm">{post.category}</span>
                  <span className="text-gray-400 text-sm">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <Button variant="link" className="text-gold hover:text-gold-light p-0">
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>
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
            <Button onClick={handleSubscribe} className="bg-gold hover:bg-gold-light text-space">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
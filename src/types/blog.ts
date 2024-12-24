export interface BlogPostSection {
  title: string;
  content: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  tags: string[];
}
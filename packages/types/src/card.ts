export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'feature' | 'product' | 'blog' | 'pricing' | 'statistic';
}

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  image?: string;
  href?: string;
  price?: string;
  badge?: string;
}

export interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  excerpt: string;
  image?: string;
  href?: string;
  date?: string;
  author?: string;
  readTime?: string;
}

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  price: string;
  period?: string;
  description?: string;
  features?: string[];
  cta?: string;
  href?: string;
  popular?: boolean;
}

export interface StatisticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

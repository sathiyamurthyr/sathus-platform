export interface FadeProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  duration?: number;
  delay?: number;
}

export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
}

export interface ScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  from?: number;
  to?: number;
  duration?: number;
  delay?: number;
}

export interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  transition?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  delay?: number;
  children: React.ReactNode;
}

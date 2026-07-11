export interface IconWrapperProps extends React.SVGAttributes<SVGElement> {
  name: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const variants = { primary: 'btn-primary', outline: 'btn-outline', light: 'btn-light' };

export default function Button({ to, href, variant = 'primary', arrow = false, children, className = '', ...rest }) {
  const cls = `btn ${variants[variant]} ${className}`;
  const content = <>{children}{arrow && <ArrowUpRight size={15} />}</>;
  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{content}</a>;
  return <button className={cls} {...rest}>{content}</button>;
}

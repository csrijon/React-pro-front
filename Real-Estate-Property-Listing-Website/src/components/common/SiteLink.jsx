import { Link, NavLink } from 'react-router-dom'

const isExternal = (to) => /^https?:\/\//i.test(to)

/** A link from the owner's menu settings: a page path stays inside the app, a full address opens in a new tab. */
export default function SiteLink({ to, nav = false, className, children, ...rest }) {
  if (isExternal(to)) return <a href={to} target="_blank" rel="noopener noreferrer" className={typeof className === 'function' ? className({ isActive: false }) : className} {...rest}>{children}</a>
  if (nav) return <NavLink to={to} end={to === '/'} className={className} {...rest}>{children}</NavLink>
  return <Link to={to} className={typeof className === 'function' ? className({ isActive: false }) : className} {...rest}>{children}</Link>
}

import PageHeader from '../../components/public/PageHeader';
import Button from '../../components/common/Button';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta('Page not found');
  return (
    <div className="pb-24"><PageHeader title="Page not found" text="The page you’re looking for has moved or doesn’t exist." />
      <div className="shell flex gap-3"><Button to="/">Go home</Button><Button to="/projects" variant="outline">View projects</Button></div></div>
  );
}

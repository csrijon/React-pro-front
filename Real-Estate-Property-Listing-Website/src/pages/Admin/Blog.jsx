import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Pencil, Trash2, Plus, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { contentService } from '../../services/contentService'
import { formatDate } from '../../utils/format'
import { AdminHeader, Table, TableSkeleton, StatusBadge } from '../../components/admin/AdminUI'
import Drawer from '../../components/common/Drawer'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Field from '../../components/common/Field'
import ImageUploader from '../../components/forms/ImageUploader'
import { EmptyState, ErrorState } from '../../components/common/States'

function PostForm({ post, onSaved, onClose }) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { category: 'Guides', author: 'EstateHub Team', published: true, ...post, cover: post?.cover ? [post.cover] : [] } })
  const c = (e) => `input ${e ? 'input-error' : ''}`
  const submit = async (d) => {
    const body = { title: d.title, category: d.category, author: d.author, excerpt: d.excerpt, content: d.content, published: d.published, cover: d.cover[0] || '' }
    try { post ? await contentService.posts.update(post.id, body) : await contentService.posts.create(body); toast.success(post ? 'Article updated' : 'Article published'); onSaved() } catch (e) { toast.error(e.message) }
  }
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <Field label="Title" error={errors.title}><input className={c(errors.title)} {...register('title', { required: 'Enter a title', minLength: { value: 8, message: 'Title is too short' } })} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category" error={errors.category}><input className={c(errors.category)} {...register('category', { required: 'Enter a category' })} /></Field>
        <Field label="Author" error={errors.author}><input className={c(errors.author)} {...register('author', { required: 'Enter an author' })} /></Field>
      </div>
      <Field label="Short summary" error={errors.excerpt}><textarea rows={2} maxLength={300} className={`${c(errors.excerpt)} resize-none`} {...register('excerpt', { required: 'Add a short summary', minLength: { value: 20, message: 'At least 20 characters' } })} /></Field>
      <Field label="Article body (blank line between paragraphs)" error={errors.content}><textarea rows={9} className={c(errors.content)} {...register('content', { required: 'Write the article', minLength: { value: 100, message: 'At least 100 characters' } })} /></Field>
      <Field label="Cover image"><Controller name="cover" control={control} render={({ field }) => <ImageUploader value={field.value} onChange={(v) => field.onChange(v.slice(-1))} />} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-accent" {...register('published')} />Published (uncheck to save as a draft)</label>
      <div className="flex justify-end gap-2"><button type="button" className="btn-outline" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save article'}</button></div>
    </form>
  )
}

export default function AdminBlog() {
  const { data, loading, error, reload } = useAsync(() => contentService.posts.list(), [])
  const [edit, setEdit] = useState(null); const [del, setDel] = useState(null)
  const remove = async () => { try { await contentService.posts.remove(del.id); toast.success('Article deleted'); setDel(null); reload() } catch (e) { toast.error(e.message) } }
  return (
    <>
      <AdminHeader title="Blog" subtitle="Guides and market insights shown on the public site." action={<button className="btn-primary" onClick={() => setEdit({})}><Plus size={16} />New article</button>} />
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Article', 'Category', 'Date', 'Status', 'Actions']} empty={data.length === 0 && <div className="p-6"><EmptyState icon={FileText} title="No articles" text="Write your first guide." /></div>}>
          {data.map((p) => <tr key={p.id}><td className="max-w-xs px-4 py-3 font-medium">{p.title}</td><td className="px-4 py-3">{p.category}</td><td className="px-4 py-3 text-muted">{formatDate(p.createdAt)}</td><td className="px-4 py-3"><StatusBadge status={p.published ? 'Published' : 'Draft'} /></td>
            <td className="px-4 py-3"><div className="flex gap-1.5"><button className="btn-outline btn-sm" onClick={() => setEdit(p)} aria-label={`Edit ${p.title}`}><Pencil size={14} /></button><button className="btn-outline btn-sm hover:!border-red-300 hover:!text-red-600" onClick={() => setDel(p)} aria-label={`Delete ${p.title}`}><Trash2 size={14} /></button></div></td></tr>)}
        </Table>
      )}
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit article' : 'New article'} subtitle={edit?.id ? edit.title : 'Write it, then publish or save it as a draft.'}>{edit && <PostForm post={edit.id ? edit : null} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload() }} />}</Drawer>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete article?" message={`“${del?.title}” will be permanently removed.`} />
    </>
  )
}

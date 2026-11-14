import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import PageTitle from '../../components/admin/PageTitle';
import ImageUploader from '../../components/forms/ImageUploader';
import VideoField from '../../components/forms/VideoField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { pagesApi } from '../../services/api';

const TABS = ['Home', 'About', 'Contact', 'Other pages', 'Site-wide'];

const Section = ({ title, hint, children }) => (
  <fieldset className="a-card p-5 grid gap-4"><legend className="sr-only">{title}</legend>
    <div><h2 className="font-sans text-sm font-semibold">{title}</h2>{hint && <p className="text-xs text-cream/40 mt-0.5">{hint}</p>}</div>{children}</fieldset>
);
const Row = ({ children }) => <div className="grid sm:grid-cols-2 gap-4">{children}</div>;

function Text({ reg, name, label, area, required, errors, hint, ...rest }) {
  const err = name.split('.').reduce((o, k) => o?.[k], errors);
  const props = reg(name, required ? { required: `${label} is required.` } : {});
  return (
    <div><label className="a-label">{label}</label>
      {area ? <textarea rows={3} className="a-input py-2" {...props} {...rest} /> : <input className="a-input" {...props} {...rest} />}
      {hint && !err && <p className="text-[11px] text-cream/40 mt-1">{hint}</p>}
      {err && <p role="alert" className="a-err">{err.message}</p>}</div>
  );
}

function Img({ control, name, label, multiple, aspect = '16 / 9' }) {
  return (
    <div><label className="a-label">{label}</label>
      <Controller name={name} control={control} render={({ field }) => <ImageUploader compact multiple={multiple} value={field.value} onChange={field.onChange} aspect={aspect} label={multiple ? 'Drag images here or browse' : 'Drop image or browse'} />} /></div>
  );
}

// string[] <-> comma separated text
function ListInput({ control, name, label, hint }) {
  return (
    <div><label className="a-label">{label}</label>
      <Controller name={name} control={control} render={({ field }) => (
        <input className="a-input" value={(field.value || []).join(', ')} onChange={(e) => field.onChange(e.target.value.split(',').map((x) => x.trimStart()))} onBlur={() => field.onChange((field.value || []).map((x) => x.trim()).filter(Boolean))} />)} />
      {hint && <p className="text-[11px] text-cream/40 mt-1">{hint}</p>}</div>
  );
}

// string[] <-> one item per line
function LinesInput({ control, name, label, hint, rows = 5 }) {
  return (
    <div><label className="a-label">{label}</label>
      <Controller name={name} control={control} render={({ field }) => (
        <textarea rows={rows} className="a-input py-2" value={(field.value || []).join('\n')} onChange={(e) => field.onChange(e.target.value.split('\n'))} onBlur={() => field.onChange((field.value || []).map((x) => x.trim()).filter(Boolean))} />)} />
      {hint && <p className="text-[11px] text-cream/40 mt-1">{hint}</p>}</div>
  );
}

function Repeater({ control, register, name, title, hint, fields: cols, blank, addLabel, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name });
  return (
    <Section title={title} hint={hint}>
      {fields.length === 0 && <p className="text-sm text-cream/40">Nothing added yet.</p>}
      {fields.map((f, i) => (
        <div key={f.id} className="grid gap-3 sm:grid-cols-12 items-start border border-white/10 rounded-md p-3">
          {cols.map((c) => (
            <div key={c.key} className={c.span || 'sm:col-span-12'}>
              <Text reg={register} errors={errors} name={`${name}.${i}.${c.key}`} label={c.label} area={c.area} required={c.required} />
            </div>
          ))}
          <div className="sm:col-span-12 text-right"><button type="button" onClick={() => remove(i)} className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 min-h-[36px]"><Trash2 size={14} />Remove</button></div>
        </div>
      ))}
      <div><button type="button" className="a-btn a-btn-ghost" onClick={() => append(blank)}><Plus size={15} />{addLabel}</button></div>
    </Section>
  );
}

export default function Pages() {
  const { data, loading, error, reload } = useAsync(() => pagesApi.get(), []);
  const [tab, setTab] = useState('Home');
  const toast = useToast();
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm();
  const { fields: navFields } = useFieldArray({ control, name: 'site.nav' });
  useEffect(() => { if (data) reset(data); }, [data, reset]);
  if (loading) return <LoadingSpinner dark />;
  if (error) return <ErrorState dark error={error} onRetry={reload} />;

  const save = async (values) => { try { const saved = await pagesApi.save(values); reset(saved); toast.success('Website content saved'); } catch (e) { toast.error(e.message); } };
  const onInvalid = (errs) => {
    const first = ['home', 'about', 'contact', 'projectsPage', 'servicesPage', 'designersPage', 'site'].find((k) => errs[k]);
    setTab(first === 'about' ? 'About' : first === 'contact' ? 'Contact' : ['projectsPage', 'servicesPage', 'designersPage'].includes(first) ? 'Other pages' : first === 'site' ? 'Site-wide' : 'Home');
    toast.error('Some required fields are empty. Check the highlighted messages.');
  };
  const T = (name, label, extra = {}) => <Text reg={register} errors={errors} name={name} label={label} {...extra} />;
  const seo = (p) => (
    <Section title="SEO metadata" hint="Shown in search results and browser tabs.">{T(`${p}.seoTitle`, 'SEO title')}{T(`${p}.seoDescription`, 'SEO description', { area: true })}</Section>
  );
  const rep = { control, register, errors };
  const panel = 'grid gap-4 max-w-4xl';

  return (
    <form onSubmit={handleSubmit(save, onInvalid)} noValidate>
      <PageTitle title="Pages" text="Edit everything visitors see on the website. Changes go live when you save."><button className="a-btn a-btn-primary" disabled={isSubmitting || !isDirty}>{isSubmitting ? 'Saving…' : 'Save changes'}</button></PageTitle>
      <div className="flex gap-1 border-b border-white/10 mb-5 overflow-x-auto" role="tablist">
        {TABS.map((t) => <button type="button" key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`px-4 min-h-[42px] text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === t ? 'border-sage text-cream' : 'border-transparent text-cream/50 hover:text-cream'}`}>{t}</button>)}
      </div>

      {/* All tabs stay mounted (hidden) so unsaved edits are never lost when switching. */}
      <div hidden={tab !== 'Home'} role="tabpanel" className={panel}>
        <Section title="Hero section">
          {T('home.eyebrow', 'Small line above the heading')}{T('home.heroHeading', 'Heading', { required: true })}{T('home.heroText', 'Short description', { area: true })}
          <Row>{T('home.primaryButton', 'First button text')}{T('home.secondaryButton', 'Second button text')}</Row>
          <div className="grid sm:grid-cols-2 gap-4"><Img control={control} name="home.heroImage" label="Main hero image" aspect="4 / 5" /><Img control={control} name="home.heroImage2" label="Small overlay image" aspect="1 / 1" /></div>
        </Section>
        <Section title="Featured-in strip">{T('home.featuredLabel', 'Label')}<ListInput control={control} name="home.featuredIn" label="Publication names" hint="Separate names with commas." /></Section>
        <Section title="Studio introduction">{T('home.introHeading', 'Heading')}{T('home.introText', 'Text', { area: true })}{T('home.introLink', 'Link text (goes to About)')}</Section>
        <Repeater {...rep} name="home.stats" title="Statistics" addLabel="Add statistic" blank={{ value: 0, suffix: '+', label: '' }}
          fields={[{ key: 'value', label: 'Number', span: 'sm:col-span-3', required: true }, { key: 'suffix', label: 'Suffix', span: 'sm:col-span-2' }, { key: 'label', label: 'Label', span: 'sm:col-span-7', required: true }]} />
        <Section title="Projects section">{T('home.projectsHeading', 'Heading')}{T('home.projectsLink', 'Link text')}<p className="text-xs text-cream/40">Projects shown here are the ones marked “Featured” in Projects.</p></Section>
        <Section title="Services section">{T('home.servicesHeading', 'Heading')}{T('home.servicesText', 'Text', { area: true })}{T('home.servicesButton', 'Button text')}</Section>
        <Section title="Showreel video" hint="Shown on the homepage. Leave the video empty to hide the section.">
          {T('home.showreel.heading', 'Heading')}{T('home.showreel.text', 'Text', { area: true })}
          <div><label className="a-label">Video</label><Controller name="home.showreel.url" control={control} render={({ field }) => <VideoField value={field.value} onChange={field.onChange} />} /></div>
          <Img control={control} name="home.showreel.poster" label="Cover image (optional, for uploaded videos)" aspect="16 / 9" />
        </Section>
        <Section title="Design philosophy">{T('home.philosophyHeading', 'Heading')}<Img control={control} name="home.philosophyImage" label="Image" aspect="4 / 3" /></Section>
        <Repeater {...rep} name="home.philosophy" title="Philosophy points" addLabel="Add point" blank={{ title: '', text: '' }}
          fields={[{ key: 'title', label: 'Title', required: true }, { key: 'text', label: 'Text', area: true }]} />
        <Section title="Testimonials heading">{T('home.testimonialsHeading', 'Heading')}</Section>
        <Repeater {...rep} name="home.testimonials" title="Client testimonials" addLabel="Add testimonial" blank={{ name: '', role: '', quote: '' }}
          fields={[{ key: 'name', label: 'Client name', span: 'sm:col-span-6', required: true }, { key: 'role', label: 'Project / role', span: 'sm:col-span-6' }, { key: 'quote', label: 'Quote', area: true, required: true }]} />
        <Section title="Instagram gallery" hint="Links go to the Instagram URL in Settings.">
          <Row>{T('home.instagramHeading', 'Heading')}{T('home.instagramHandle', 'Handle shown next to the link')}</Row>
          <Img control={control} name="home.social" label="Gallery images" multiple aspect="1 / 1" /></Section>
        <Section title="Call to action" hint="Also used at the bottom of the Projects and Services pages.">{T('home.ctaHeading', 'Heading')}{T('home.ctaText', 'Text', { area: true })}</Section>
        {seo('home')}
      </div>

      <div hidden={tab !== 'About'} role="tabpanel" className={panel}>
        <Section title="Header">{T('about.heading', 'Page heading', { required: true })}{T('about.intro', 'Introduction', { area: true })}</Section>
        <Section title="Our story">{T('about.storyHeading', 'Heading')}{T('about.story', 'Story', { area: true })}<Img control={control} name="about.image" label="Story image" aspect="4 / 3" /><ListInput control={control} name="about.values" label="Values" hint="Separate with commas (the first three get icons)." /></Section>
        <Section title="Mission and vision"><Row>{T('about.missionHeading', 'Mission heading')}{T('about.visionHeading', 'Vision heading')}</Row>{T('about.mission', 'Mission', { area: true })}{T('about.vision', 'Vision', { area: true })}</Section>
        <Section title="Design philosophy">{T('about.philosophyHeading', 'Heading')}</Section>
        <Repeater {...rep} name="about.philosophy" title="Philosophy points" addLabel="Add point" blank={{ title: '', text: '' }}
          fields={[{ key: 'title', label: 'Title', required: true }, { key: 'text', label: 'Text', area: true }]} />
        <Section title="Process heading">{T('about.processHeading', 'Heading')}</Section>
        <Repeater {...rep} name="about.process" title="Process steps" addLabel="Add step" blank={{ title: '', text: '' }}
          fields={[{ key: 'title', label: 'Step title', required: true }, { key: 'text', label: 'Description', area: true }]} />
        <Repeater {...rep} name="about.stats" title="Statistics" addLabel="Add statistic" blank={{ value: 0, suffix: '+', label: '' }}
          fields={[{ key: 'value', label: 'Number', span: 'sm:col-span-3', required: true }, { key: 'suffix', label: 'Suffix', span: 'sm:col-span-2' }, { key: 'label', label: 'Label', span: 'sm:col-span-7', required: true }]} />
        <Section title="Team section"><Row>{T('about.teamHeading', 'Heading')}{T('about.teamLink', 'Link text')}</Row></Section>
        {seo('about')}
      </div>

      <div hidden={tab !== 'Contact'} role="tabpanel" className={panel}>
        <Section title="Header">{T('contact.heading', 'Heading')}{T('contact.text', 'Text', { area: true })}</Section>
        <Section title="Contact information">{T('contact.email', 'Email', { required: true })}{T('contact.phone', 'Phone')}{T('contact.address', 'Office address')}</Section>
        <Section title="Map" hint="By default a Google map of the office address is shown.">
          <label className="flex items-center justify-between min-h-[40px] text-sm text-cream/80">Show map<input type="checkbox" className="h-5 w-5 accent-[#A7B49B]" {...register('contact.showMap')} /></label>
          {T('contact.mapUrl', 'Custom map embed link (optional)', { hint: 'Paste a Google Maps “Embed a map” link or the whole <iframe> code. Leave empty to use the address above.' })}
        </Section>
        <Section title="Inquiry form">{T('contact.formHeading', 'Form heading')}<p className="text-xs text-cream/40">Project types and budget options are managed in the Site-wide tab.</p></Section>
        {seo('contact')}
      </div>

      <div hidden={tab !== 'Other pages'} role="tabpanel" className={panel}>
        <Section title="Projects page">{T('projectsPage.heading', 'Heading')}{T('projectsPage.text', 'Description', { area: true })}
          {T('projectsPage.detailCtaHeading', 'Project page call-to-action heading', { hint: 'Use {title} to insert the project name.' })}{T('projectsPage.detailCtaText', 'Project page call-to-action text', { area: true })}</Section>
        {seo('projectsPage')}
        <Section title="Services page">{T('servicesPage.heading', 'Heading')}{T('servicesPage.text', 'Description', { area: true })}</Section>
        {seo('servicesPage')}
        <Section title="Designers page">{T('designersPage.heading', 'Heading')}{T('designersPage.text', 'Description', { area: true })}
          {T('designersPage.ctaHeading', 'Call-to-action heading')}{T('designersPage.ctaText', 'Call-to-action text', { area: true })}{T('designersPage.ctaLabel', 'Call-to-action button')}</Section>
        {seo('designersPage')}
      </div>

      <div hidden={tab !== 'Site-wide'} role="tabpanel" className={panel}>
        <Section title="Menu" hint="Rename or hide menu items. Hidden pages stay reachable by direct link.">
          {navFields.map((f, i) => (
            <div key={f.id} className="grid grid-cols-[1fr_auto] gap-3 items-end">
              <div><label className="a-label">{f.to === '/' ? 'Home' : f.to.replace('/', '')} — menu label</label><input className="a-input" {...register(`site.nav.${i}.label`, { required: 'Enter a label.' })} /></div>
              <label className="flex items-center gap-2 min-h-[42px] text-sm text-cream/70"><input type="checkbox" className="h-5 w-5 accent-[#A7B49B]" {...register(`site.nav.${i}.visible`)} />Show</label>
            </div>
          ))}
          {T('site.ctaLabel', 'Menu button text', { required: true })}
        </Section>
        <Section title="Footer">{T('site.footerTagline', 'Tagline', { area: true })}<Row>{T('site.footerExploreHeading', 'Links heading')}{T('site.footerStudioHeading', 'Contact heading')}</Row>{T('site.copyright', 'Copyright text', { hint: 'The year is added automatically.' })}</Section>
        <Section title="Project categories" hint="Used for the project filter on the website and the category choice in the project form.">
          <LinesInput control={control} name="site.categories" label="Categories (one per line)" />
        </Section>
        <Section title="Inquiry form options" hint="The choices visitors see in the contact form.">
          <LinesInput control={control} name="site.projectTypes" label="Project types (one per line)" />
          <LinesInput control={control} name="site.budgets" label="Budget ranges (one per line)" />
        </Section>
      </div>
    </form>
  );
}

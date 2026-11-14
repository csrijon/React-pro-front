import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { AdminHeader } from '../../components/admin/AdminUI'
import Field from '../../components/common/Field'
import SingleImage from '../../components/forms/SingleImage'
import { ChipList, LinkList, SectionOrder } from '../../components/admin/SettingsEditors'
import { applyFonts } from '../../utils/siteApply'
import { FONT_CHOICES } from '../../data/siteDefaults'
import { rules } from '../../components/forms/EnquiryForm'
import { USE_MOCK, API_URL } from '../../services/config'
import { settingsService, SOCIAL_NETWORKS } from '../../services/settingsService'
import { useSite } from '../../context/SiteContext'
import { useAsync } from '../../hooks/useAsync'
import { applyTheme, contrastWithWhite, isHex } from '../../utils/theme'
import { HERO_IMAGE, ABOUT_IMAGE } from '../../data/images'
import { PageLoader, ErrorState } from '../../components/common/States'

const TABS = [['brand', 'Brand'], ['home', 'Home page'], ['about', 'About page'], ['pages', 'Other pages'], ['menus', 'Menus'], ['choices', 'Choices & currency'], ['contact', 'Contact & footer'], ['social', 'Social media'], ['seo', 'Search']]
const SECTION_OF = { company: 'brand', tagline: 'brand', logo: 'brand', favicon: 'brand', fonts: 'brand', showNameWithLogo: 'brand', theme: 'brand', pages: 'pages', nav: 'menus', footerLinks: 'menus', options: 'choices', currency: 'choices', hero: 'home', stats: 'home', about: 'about', email: 'contact', phone: 'contact', address: 'contact', workingHours: 'contact', footer: 'contact', notify: 'contact', social: 'social', seo: 'seo' }
const LABELS = { facebook: 'Facebook', instagram: 'Instagram', twitter: 'X (Twitter)', linkedin: 'LinkedIn', youtube: 'YouTube' }
const PLACEHOLDERS = { facebook: 'https://facebook.com/yourpage', instagram: 'https://instagram.com/yourprofile', twitter: 'https://x.com/yourhandle', linkedin: 'https://linkedin.com/company/yourcompany', youtube: 'https://youtube.com/@yourchannel' }
const httpsLink = (v) => !v || (/^https:\/\//i.test(v.trim()) && URL.canParse(v.trim())) || 'Enter a full link starting with https://'

export default function AdminSettings() {
  const s = useAsync(() => settingsService.get(), [])
  if (s.loading) return <PageLoader />
  if (s.error) return <ErrorState error={s.error} onRetry={s.reload} />
  return <SettingsForm initial={s.data} />
}

function ColorField({ label, value, onChange, minContrast, error }) {
  const ratio = contrastWithWhite(value)
  const bad = isHex(value) && ratio < minContrast
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={isHex(value) ? value : '#000000'} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-11 w-14 cursor-pointer rounded-lg border border-line bg-white p-1" aria-label={`${label} picker`} />
        <input className={`input w-32 font-mono uppercase ${error || bad ? 'input-error' : ''}`} value={value} maxLength={7} onChange={(e) => onChange(e.target.value.toUpperCase())} aria-label={`${label} hex code`} />
        <span className="grid h-11 place-items-center rounded-lg px-4 text-sm font-semibold text-white" style={{ background: isHex(value) ? value : '#000' }}>Sample</span>
      </div>
      {(error || bad) && <p className="field-error" role="alert">{error || 'Too light: white text on this colour would be hard to read. Pick a darker shade.'}</p>}
    </div>
  )
}

function SettingsForm({ initial }) {
  const { site, setSite } = useSite()
  const [tab, setTab] = useState('brand')
  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting, isDirty } } = useForm({ defaultValues: initial })

  // Live colour preview while editing; reverts to the saved theme if you leave without saving.
  const theme = watch('theme')
  useEffect(() => { if (isHex(theme?.primary) && isHex(theme?.accent)) applyTheme(theme) }, [theme?.primary, theme?.accent]) // eslint-disable-line react-hooks/exhaustive-deps
  const fonts = watch('fonts')
  useEffect(() => { if (fonts?.heading && fonts?.body) applyFonts(fonts) }, [fonts?.heading, fonts?.body]) // eslint-disable-line react-hooks/exhaustive-deps
  const savedFonts = useRef(site.fonts)
  savedFonts.current = site.fonts
  useEffect(() => () => applyFonts(savedFonts.current), [])
  const savedTheme = useRef(site.theme)
  savedTheme.current = site.theme
  useEffect(() => () => applyTheme(savedTheme.current), []) // leaving the page restores whatever is saved

  const save = async (d) => {
    const clean = { ...d, social: Object.fromEntries(SOCIAL_NETWORKS.map((k) => [k, (d.social?.[k] || '').trim()])) }
    try { const saved = await settingsService.save(clean); setSite(saved); applyTheme(saved.theme); reset(saved); toast.success('Saved. Your website now shows these changes.') }
    catch (e) { toast.error(e.message) }
  }
  const onInvalid = (errs) => { const first = SECTION_OF[Object.keys(errs)[0]]; if (first) setTab(first); toast.error('Please fix the highlighted fields') }
  const c = (e) => `input ${e ? 'input-error' : ''}`
  const text = (min, label) => ({ required: `Enter ${label}`, minLength: { value: min, message: `${label} is too short` } })
  const tabHasError = (id) => Object.keys(errors).some((k) => SECTION_OF[k] === id)
  const panel = (id) => (tab === id ? 'space-y-5' : 'hidden') // hidden panels stay mounted so every field is still validated and saved

  return (
    <>
      <AdminHeader title="Settings" subtitle="Change your logo, name, colours, page text and contact details. The website updates as soon as you save." />
      <form onSubmit={handleSubmit(save, onInvalid)} noValidate className="max-w-3xl">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Settings sections">
          {TABS.map(([id, name]) => (
            <button type="button" key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${tab === id ? 'border-primary bg-primary text-white' : 'border-line bg-white'}`}>
              {name}{tabHasError(id) && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500" aria-label="Has errors" />}
            </button>
          ))}
        </div>

        <div className="card p-6">
          <section className={panel('brand')} role="tabpanel" aria-label="Brand">
            <Controller name="logo" control={control} render={({ field }) => <SingleImage label="Logo" value={field.value} onChange={field.onChange} png max={600} wide={false} hint="PNG with a transparent background works best. Shown in the header, footer and sign-in pages. Leave empty to use the default icon." />} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-accent" {...register('showNameWithLogo')} />Show the company name next to the logo <span className="text-muted">(turn off if your logo already contains the name)</span></label>
            <Field label="Company name" error={errors.company}><input className={c(errors.company)} {...register('company', text(1, 'the company name'))} /></Field>
            <Field label="Tagline (optional)" error={errors.tagline}><input className={c(errors.tagline)} maxLength={120} {...register('tagline')} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Controller name="theme.primary" control={control} rules={{ validate: (v) => (isHex(v) ? contrastWithWhite(v) >= 4.5 || 'Too light: white text on it would be hard to read' : 'Use a colour like #063E2F') }} render={({ field }) => <ColorField label="Main colour (header, buttons)" value={field.value} onChange={field.onChange} minContrast={4.5} error={errors.theme?.primary?.message} />} />
              <Controller name="theme.accent" control={control} rules={{ validate: (v) => (isHex(v) ? contrastWithWhite(v) >= 3 || 'Too light: white text on it would be hard to read' : 'Use a colour like #267032') }} render={({ field }) => <ColorField label="Accent colour (highlights, links)" value={field.value} onChange={field.onChange} minContrast={3} error={errors.theme?.accent?.message} />} />
            </div>
            <button type="button" className="btn-ghost btn-sm" onClick={() => { setValue('theme.primary', '#063E2F', { shouldDirty: true }); setValue('theme.accent', '#267032', { shouldDirty: true }) }}>Reset colours to default</button>
            <div className="grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
              <Field label="Heading font"><select className="input" {...register('fonts.heading')}>{FONT_CHOICES.map((f) => <option key={f}>{f}</option>)}</select></Field>
              <Field label="Body font"><select className="input" {...register('fonts.body')}>{FONT_CHOICES.map((f) => <option key={f}>{f}</option>)}</select></Field>
              <p className="sm:col-span-2 text-sm text-muted">The whole website switches fonts when you save. Preview: <span className="font-heading text-base font-semibold text-ink">Find your dream property</span> <span className="font-body text-ink">— body text looks like this.</span></p>
            </div>
            <Controller name="favicon" control={control} render={({ field }) => <SingleImage label="Browser tab icon (favicon)" value={field.value} onChange={field.onChange} png max={128} wide={false} hint="A small square PNG (at least 64×64). Leave empty to use the default icon." />} />
          </section>

          <section className={panel('home')} role="tabpanel" aria-label="Home page">
            <Field label="Hero headline" error={errors.hero?.title}><input className={c(errors.hero?.title)} maxLength={80} {...register('hero.title', text(3, 'a headline'))} /></Field>
            <Field label="Hero sub-text" error={errors.hero?.subtitle}><textarea rows={2} maxLength={240} className={`${c(errors.hero?.subtitle)} resize-none`} {...register('hero.subtitle')} /></Field>
            <Controller name="hero.image" control={control} render={({ field }) => <SingleImage label="Hero background photo" value={field.value} onChange={field.onChange} fallback={HERO_IMAGE} hint="A wide, high-quality photo (at least 1600px wide) looks best." />} />
            <fieldset className="space-y-3 border-t border-line pt-5"><legend className="font-semibold">Page sections</legend>
              <p className="text-sm text-muted">Choose the order of the sections below the hero, and hide the ones you do not want.</p>
              <Controller name="home.sections" control={control} render={({ field }) => <SectionOrder value={field.value} onChange={field.onChange} />} />
            </fieldset>
            <fieldset className="space-y-3 border-t border-line pt-5"><legend className="font-semibold">Section titles</legend>
              <p className="text-sm text-muted">Tip: type <code className="rounded bg-slate-100 px-1">{'{company}'}</code> to insert your company name.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Featured properties" error={errors.home?.featuredTitle}><input className={c(errors.home?.featuredTitle)} {...register('home.featuredTitle', { required: 'Enter a title' })} /></Field>
                <Field label="Featured projects" error={errors.home?.projectsTitle}><input className={c(errors.home?.projectsTitle)} {...register('home.projectsTitle', { required: 'Enter a title' })} /></Field>
                <Field label="Testimonials" error={errors.home?.testimonialsTitle}><input className={c(errors.home?.testimonialsTitle)} {...register('home.testimonialsTitle', { required: 'Enter a title' })} /></Field>
                <Field label="“Why choose us” title" error={errors.home?.whyTitle}><input className={c(errors.home?.whyTitle)} {...register('home.whyTitle', { required: 'Enter a title' })} /></Field>
              </div>
              <Field label="“Why choose us” intro (optional)"><input className={c()} maxLength={200} {...register('home.whyIntro')} /></Field>
            </fieldset>
            <fieldset className="space-y-3 border-t border-line pt-5"><legend className="font-semibold">“Why choose us” cards</legend>
              <p className="text-sm text-muted">Four cards, shown on the home page and the About page.</p>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-[1fr_2fr]">
                  <Field error={errors.home?.whyCards?.[i]?.title}><input className={c(errors.home?.whyCards?.[i]?.title)} aria-label={`Card ${i + 1} title`} maxLength={50} placeholder="Title" {...register(`home.whyCards.${i}.title`, { required: 'Enter a title' })} /></Field>
                  <Field><input className={c()} aria-label={`Card ${i + 1} text`} maxLength={200} placeholder="Short description" {...register(`home.whyCards.${i}.text`)} /></Field>
                </div>
              ))}
            </fieldset>
            <fieldset className="space-y-3 border-t border-line pt-5"><legend className="font-semibold">“Sell or rent” box</legend>
              <Field label="Title" error={errors.home?.cta?.title}><input className={c(errors.home?.cta?.title)} maxLength={100} {...register('home.cta.title', { required: 'Enter a title' })} /></Field>
              <Field label="Text"><textarea rows={2} maxLength={240} className={`${c()} resize-none`} {...register('home.cta.text')} /></Field>
              <Field label="Button text (also used by the header button)" error={errors.home?.cta?.button}><input className={c(errors.home?.cta?.button)} maxLength={30} {...register('home.cta.button', { required: 'Enter the button text' })} /></Field>
            </fieldset>
            <fieldset className="space-y-3 border-t border-line pt-5"><legend className="font-semibold">Headline numbers</legend>
              <p className="text-sm text-muted">Shown on the home page and the About page.</p>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-[7rem_1fr] gap-3">
                  <Field error={errors.stats?.[i]?.value}><input className={c(errors.stats?.[i]?.value)} maxLength={12} aria-label={`Number ${i + 1}`} placeholder="10K+" {...register(`stats.${i}.value`, { required: 'Enter a number' })} /></Field>
                  <Field error={errors.stats?.[i]?.label}><input className={c(errors.stats?.[i]?.label)} maxLength={30} aria-label={`Label ${i + 1}`} placeholder="Properties" {...register(`stats.${i}.label`, { required: 'Enter a label' })} /></Field>
                </div>
              ))}
            </fieldset>
          </section>

          <section className={panel('about')} role="tabpanel" aria-label="About page">
            <Field label="Subtitle" error={errors.about?.subtitle}><input className={c(errors.about?.subtitle)} {...register('about.subtitle')} /></Field>
            <Field label="Main statement" error={errors.about?.heading}><textarea rows={2} className={`${c(errors.about?.heading)} resize-none`} {...register('about.heading', text(3, 'a statement'))} /></Field>
            <Field label="Introduction"><textarea rows={3} className={`${c()} resize-none`} {...register('about.intro')} /></Field>
            <Field label="Our story (leave a blank line between paragraphs)"><textarea rows={6} className={c()} {...register('about.story')} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Mission"><textarea rows={3} className={`${c()} resize-none`} {...register('about.mission')} /></Field>
              <Field label="Vision"><textarea rows={3} className={`${c()} resize-none`} {...register('about.vision')} /></Field>
            </div>
            <Controller name="about.image" control={control} render={({ field }) => <SingleImage label="About page photo" value={field.value} onChange={field.onChange} fallback={ABOUT_IMAGE} />} />
          </section>

          <section className={panel('pages')} role="tabpanel" aria-label="Other pages">
            <p className="text-sm text-muted">Text on the sign-in, sign-up and list-your-property pages. Use <code className="rounded bg-slate-100 px-1">{'{company}'}</code> to insert your company name.</p>
            {[['login', 'Log in page'], ['register', 'Create account page'], ['listProperty', 'List your property page']].map(([k, name]) => (
              <fieldset key={k} className="space-y-3 rounded-xl border border-line p-4"><legend className="px-1 font-semibold">{name}</legend>
                <Field label="Title" error={errors.pages?.[k]?.title}><input className={c(errors.pages?.[k]?.title)} maxLength={60} {...register(`pages.${k}.title`, { required: 'Enter a title' })} /></Field>
                <Field label="Sub-text"><input className={c()} maxLength={200} {...register(`pages.${k}.subtitle`)} /></Field>
                {k === 'login' && <>
                  <Field label="Side panel headline (desktop)"><input className={c()} maxLength={100} {...register('pages.login.sideTitle')} /></Field>
                  <Field label="Side panel text"><input className={c()} maxLength={200} {...register('pages.login.sideText')} /></Field>
                </>}
                {k === 'listProperty' && <Field label="Privacy note above the form"><textarea rows={2} maxLength={300} className={`${c()} resize-none`} {...register('pages.listProperty.privacy')} /></Field>}
              </fieldset>
            ))}
          </section>

          <section className={panel('menus')} role="tabpanel" aria-label="Menus">
            <div><h3 className="font-semibold">Header menu</h3><p className="mb-3 text-sm text-muted">Up to 8 items. Use a page path like <code className="rounded bg-slate-100 px-1">/properties</code> or a full <code className="rounded bg-slate-100 px-1">https://</code> link (opens in a new tab).</p>
              <LinkList control={control} register={register} name="nav" errors={errors.nav} min={1} max={8} />{errors.nav?.message && <p className="field-error">{errors.nav.message}</p>}</div>
            <div className="border-t border-line pt-5"><h3 className="font-semibold">Footer “Quick links”</h3><p className="mb-3 text-sm text-muted">Up to 16 links.</p>
              <LinkList control={control} register={register} name="footerLinks" errors={errors.footerLinks} max={16} /></div>
          </section>

          <section className={panel('choices')} role="tabpanel" aria-label="Choices and currency">
            <Controller name="options.propertyTypes" control={control} rules={{ validate: (v) => v.length > 0 || 'Keep at least one property type' }} render={({ field }) => <ChipList label="Property types" value={field.value} onChange={field.onChange} max={12} placeholder="e.g. Farmhouse" error={errors.options?.propertyTypes?.message} hint="Used in search filters, forms and the footer. A type that listings still use cannot be removed." />} />
            <Controller name="options.furnishing" control={control} rules={{ validate: (v) => v.length > 0 || 'Keep at least one option' }} render={({ field }) => <ChipList label="Furnishing options" value={field.value} onChange={field.onChange} max={6} placeholder="e.g. Part-furnished" error={errors.options?.furnishing?.message} />} />
            <Controller name="options.amenities" control={control} render={({ field }) => <ChipList label="Amenities to choose from" value={field.value} onChange={field.onChange} max={40} placeholder="e.g. Rooftop Terrace" hint="Offered as tick-boxes when adding a property." />} />
            <Controller name="options.timeSlots" control={control} rules={{ validate: (v) => v.length > 0 || 'Keep at least one visit time' }} render={({ field }) => <ChipList label="Visit time slots" value={[...field.value].sort()} onChange={(v) => field.onChange([...v].sort())} max={24} placeholder="24-hour time, e.g. 14:30" validate={(v) => (/^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? '' : 'Use a 24-hour time like 14:30')} error={errors.options?.timeSlots?.message} hint="Visitors can book a property visit at these times." />} />
            <div className="grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
              <Field label="Currency symbol" error={errors.currency?.symbol}><input className={c(errors.currency?.symbol)} maxLength={4} {...register('currency.symbol', { required: 'Enter a symbol', pattern: { value: /^[^<>&"'\s]+$/, message: 'Symbol has invalid characters' } })} /></Field>
              <Field label="Number format"><select className="input" {...register('currency.system')}><option value="indian">Indian: ₹12,50,000 · ₹1.25 Cr · ₹50 Lakh</option><option value="international">International: $1,250,000 · $1.25M</option></select></Field>
            </div>
          </section>

          <section className={panel('contact')} role="tabpanel" aria-label="Contact and footer">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Support email" error={errors.email}><input type="email" className={c(errors.email)} {...register('email', rules.email)} /></Field>
              <Field label="Phone" error={errors.phone}><input className={c(errors.phone)} {...register('phone', rules.phone)} /></Field>
            </div>
            <Field label="Office address" error={errors.address}><input className={c(errors.address)} {...register('address', { required: 'Enter the address' })} /></Field>
            <Field label="Working hours" error={errors.workingHours}><input className={c(errors.workingHours)} maxLength={100} placeholder="Mon – Sat: 9:00 AM – 7:00 PM" {...register('workingHours')} /></Field>
            <Field label="Footer description" error={errors.footer?.about}><textarea rows={3} maxLength={400} className={`${c(errors.footer?.about)} resize-none`} {...register('footer.about')} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-accent" {...register('notify')} />Email me when a new enquiry arrives</label>
          </section>

          <section className={panel('social')} role="tabpanel" aria-label="Social media">
            <p className="text-sm text-muted">Shown as icons in the website footer. Leave a field empty to hide that icon.</p>
            {SOCIAL_NETWORKS.map((k) => (
              <Field key={k} label={LABELS[k]} error={errors.social?.[k]}>
                <input type="url" inputMode="url" autoComplete="off" className={c(errors.social?.[k])} placeholder={PLACEHOLDERS[k]} {...register(`social.${k}`, { validate: httpsLink })} />
              </Field>
            ))}
          </section>

          <section className={panel('seo')} role="tabpanel" aria-label="Search">
            <Field label="Site description for search engines" error={errors.seo?.description}><textarea rows={3} maxLength={300} className={`${c(errors.seo?.description)} resize-none`} {...register('seo.description')} /></Field>
            <p className="text-sm text-muted">Used on pages that do not have their own description. Page titles automatically end with your company name.</p>
          </section>
        </div>

        <div className="sticky bottom-0 -mx-4 mt-5 flex items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
          <p className="text-sm text-muted">{isDirty ? 'You have unsaved changes.' : 'All changes saved.'}</p>
          <button className="btn-primary" disabled={isSubmitting || !isDirty}>{isSubmitting ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>

      <div className="card mt-6 max-w-3xl p-6 text-sm"><h2 className="font-semibold">Data source</h2>
        <p className="mt-2 text-muted">{USE_MOCK ? 'Running on built-in demo data stored in this browser. Set VITE_API_URL in your .env file to connect your backend.' : `Connected to ${API_URL}`}</p>
        {USE_MOCK && <button className="btn-outline btn-sm mt-3" onClick={() => { Object.keys(localStorage).filter((k) => k.startsWith('estatehub:mock:')).forEach((k) => localStorage.removeItem(k)); toast.success('Demo data reset'); setTimeout(() => location.reload(), 500) }}>Reset demo data</button>}</div>
    </>
  )
}

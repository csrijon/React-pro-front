export const WEATHER = {
  place: 'কলকাতা, পশ্চিমবঙ্গ',
  tempC: 31,
  humidity: 78,
  rainChance: 60,
  windKph: 12,
  condition: 'আংশিক মেঘলা, বৃষ্টির সম্ভাবনা',
  updated: 'আজ, সকাল ৯:০০',
}

const KB = [
  {
    keys: ['ধান', 'rice', 'চাল', 'paddy'],
    title: 'ধান (চাল গাছ)',
    answer:
      'ধানের জন্য ভালো জল ও আর্দ্রতা প্রয়োজন। বীজ তৈরির সময় ২৫–৩০°C তাপমাত্রা উপযোগী। পানি সেচ দেওয়ার সময় গাছের কোমর পর্যন্ত পানি থাকতে দিন এবং ফুল ফোটার সময় পানি কমিয়ে দিন। প্রতি বিঘায় ৮০–১০০ কেজি সার (৪:২:৪ অনুপাত) ভালো ফলন দেয়।',
    tools: ['knowledge_base', 'rag'],
  },
  {
    keys: ['পাতা', 'leaf', 'disease', 'রোগ', 'ছোপ', 'blight', 'blast'],
    title: 'পাতার রোগ',
    answer:
      'পাতায় দাগ বা ছোপ দেখা গেলে প্রথমে আক্রান্ত পাতা কেড়ে ফেলুন ও জ্বালিয়ে দিন। পরবর্তীতে ম্যাঙ্কোজেব ০.২৫% বা কপার অক্সিক্লোরাইড ০.৩% দিয়ে স্প্রে করুন — সপ্তাহে একবার, মোট ২–৩ বার। ছবি পাঠালে আমরা কম্পিউটার ভিশন মডেল দিয়ে রোগ শনাক্ত করে দেখাব।',
    tools: ['knowledge_base', 'disease_model', 'rag'],
  },
  {
    keys: ['আবহাওয়া', 'weather', 'বৃষ্টি', 'rain', 'তাপমাত্রা'],
    title: 'আবহাওয়া ভিত্তিক পরামর্শ',
    answer:
      'আজ আপনার এলাকায় বৃষ্টির সম্ভাবনা ৬০%, আর্দ্রতা ৭৮%। বৃষ্টির আগে সার বা কীটনাশক স্প্রে করবেন না — এতে সার ধুয়ে যাবে ও উৎপাদন নষ্ট হবে। পরদিন সকালে সেচ ও স্প্রের কাজ করলে ভালো ফল পাবেন।',
    tools: ['weather_service', 'rag'],
  },
  {
    keys: ['সার', 'fertilizer', 'নাইট্রোজেন', 'urea', 'ইউরিয়া'],
    title: 'সার ব্যবস্থাপনা',
    answer:
      'ইউরিয়া সবসময় ভেজা মাটিতে দিন, শুকনো মাটিতে দিলে নাইট্রোজেন উড়ে যায়। অল্প পরিমাণে একাধিকবার দেওয়াই ভালো — ধানে ২ ভাগে, সবজিতে ৩ ভাগে ভাগ করে দিন। মাটি পরীক্ষা করিয়ে সারের চাহিদা নির্ণয় করলে খরচও কমে।',
    tools: ['knowledge_base', 'rag'],
  },
  {
    keys: ['পোক', 'pest', 'কীট', 'insect', 'মাছি', 'পোকামাকড়'],
    title: 'পোকামাকড় নিয়ন্ত্রণ',
    answer:
      'পোকা ধরতে পিওট্র্যাপ (ফেরোমোন ট্র্যাপ) বসান এবং সন্ধ্যায় নিয়ন্ত্রিত আলোর ফাঁদ ব্যবহার করুন। রাসায়নিক কীটনাশক ব্যবহারের আগে মাত্রা ও নিরাপদ অন্তরাল মানুন, এবং দিনের বেলা ৪টার পরে স্প্রে করুন।',
    tools: ['knowledge_base', 'rag'],
  },
  {
    keys: ['সেচ', 'irrigation', 'পানি', 'water'],
    title: 'সেচ ব্যবস্থা',
    answer:
      'সকাল বা সন্ধ্যায় সেচ দিলে পানি বাষ্পীভবনে কম নষ্ট হয়। ফল ও ফুল ফোটার সময় পানির চাহিড়া বেশি — এই সময় ৩–৫ দিন পর পর সেচ দিন। ড্রিপ বা মালচিং করলে পানি ও খরচ দুটোই অনেকটা বাঁচে।',
    tools: ['knowledge_base', 'rag'],
  },
]

const FALLBACK = {
  title: 'সাধারণ পরামর্শ',
  answer:
    'আপনার প্রশ্নটি আমি বুঝতে পেরেছি, তবে আরও নির্দিষ্ট করতে পারি — কোন ফসল, কোন অংশে সমস্যা, কত দিন ধরে? ছবি থাকলে জমা দিন, আমার কম্পিউটার ভিশন মডেল রোগ শনাক্ত করে দেবে।',
  tools: ['rag'],
}

const CLOSING =
  ' জটিল বা অস্পষ্ট পরিস্থিতিতে স্থানীয় কৃষি বিশেষজ্ঞের পরামর্শ নেওয়া ভালো।'

export const DEMO_QUESTIONS = [
  'ধানের গাছে কী সার দেব?',
  'আজ আবহাওয়া কেমন?',
  'পাতায় সাদা ছোপ হচ্ছে, কী করব?',
  'টমেটোতে পোকা ধরছে',
]

const DELAY = (ms) => new Promise((r) => setTimeout(r, ms))

function matchEntry(text) {
  const t = text.toLowerCase()
  return KB.find((e) => e.keys.some((k) => t.includes(k))) || FALLBACK
}

const STEP_LABELS = [
  { id: 'stt', label: 'কণ্ঠ লিপিবদ্ধ (STT)' },
  { id: 'intent', label: 'অভিপ্রায় বিশ্লেষণ' },
  { id: 'tools', label: 'টুল নির্বাচন' },
  { id: 'retrieve', label: 'জ্ঞানভাণ্ডার থেকে তথ্য আহরণ' },
  { id: 'generate', label: 'উত্তর তৈরি (RAG)' },
  { id: 'tts', label: 'বাংলা বাণী রূপান্তর (TTS)' },
]

export { STEP_LABELS }

export async function askAgent({ text, hasImage = false, onStep }) {
  const steps = STEP_LABELS.map((s) => ({ ...s, status: 'pending' }))
  const emit = (id, status) => {
    const s = steps.find((x) => x.id === id)
    if (s) s.status = status
    onStep?.([...steps])
  }

  const entry = matchEntry(text)
  const tools = [...new Set(entry.tools)]

  emit('stt', 'running')
  await DELAY(450)
  emit('stt', 'done')

  emit('intent', 'running')
  await DELAY(400)
  emit('intent', 'done')

  emit('tools', 'running')
  await DELAY(350)
  emit('tools', 'done')

  emit('retrieve', 'running')
  await DELAY(550)
  emit('retrieve', 'done')

  emit('generate', 'running')
  await DELAY(600)
  emit('generate', 'done')

  emit('tts', 'running')
  await DELAY(400)
  emit('tts', 'done')

  let answer = `${entry.answer}\n\nপ্রয়োজনীয় টুল: ${tools
    .map(toolName)
    .join(', ')}।`
  if (hasImage) answer += '\n\nআপনার পাঠানো ছবি বিশ্লেষণ করা হয়েছে — ফলাফল ডান পাশে দেখুন।'
  answer += CLOSING

  return { text: answer, tools, title: entry.title }
}

function toolName(id) {
  const map = {
    weather_service: 'আবহাওয়া সেবা',
    knowledge_base: 'কৃষি জ্ঞানভাণ্ডার',
    disease_model: 'রোগ শনাক্ত মডেল',
    rag: 'RAG সার্চ',
  }
  return map[id] || id
}

const DISEASES = [
  {
    name: 'ধানের ব্লাস্ট (পাতার রোগ)',
    confidence: 92,
    advice:
      'ম্যাঙ্কোজেব ০.২৫% স্প্রে করুন, সপ্তাহে ১ বার, ২ বার। আক্রান্ত পাতা সরিয়ে ফেলুন এবং বীজ বাছাই করে রোপণ করুন।',
  },
  {
    name: 'ব্লাইট (ছত্রাকজনিত রোগ)',
    confidence: 87,
    advice:
      'পানি নিষ্কাশনের ব্যবস্থা ঠিক করুন, জল জমতে দেবেন না। কপার আधারিত কীটনাশক ০.৩% মাত্রায় দিন এবং সংক্রমিত গাছ আলাদা করুন।',
  },
]

export async function analyzeImage({ onProgress }) {
  const stages = [
    'ছবি প্রসেস হচ্ছে…',
    'পাতার বৈশিষ্ট্য বিশ্লেষণ…',
    'রোগ মডেলে তুলনা…',
  ]
  for (const s of stages) {
    onProgress?.(s)
    await DELAY(700)
  }
  const pick = DISEASES[Math.floor(Math.random() * DISEASES.length)]
  onProgress?.('সম্পন্ন')
  return pick
}

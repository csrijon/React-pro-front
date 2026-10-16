// Step 1 of the agent: classify the question into one advisory topic.
// This is a simple keyword rules engine (not an LLM) so the student can read
// and change it easily. Topics: crop_problem | irrigation | pest | fertilizer | general.
const TOPICS = {
  irrigation: [
    'পানি', 'সেচ', 'জলসেচ', 'জল', 'শুকিয়ে', 'নিকাশি', 'ড্রেনেজ',
    'water', 'irrigat', 'drain', 'rain', 'বৃষ্টি',
  ],
  pest: [
    'রোগ', 'পোক', 'পোকামাকড়', 'ইলা', 'ছতলা', 'ছোপ', 'দাগ', 'পাতা', 'কীট',
    'পিঙ্গন', 'লালা', 'blight', 'blast', 'pest', 'disease', 'insect', 'bug',
    'leaf', 'spot', 'rust', 'aphid', 'borer',
  ],
  fertilizer: [
    'সার', 'ইউরিয়া', 'নাইট্রোজেন', 'ফসফরাস', 'পটাশ', 'কম্পোস্ট', 'গোবর',
    'fertil', 'urea', 'nitrogen', 'compost', 'manure', 'npk',
  ],
  crop_problem: [
    'ফসল', 'জমি', 'ক্ষেত', 'ফলন', 'গাছ', 'ধান', 'চাল', 'আলু', 'পাট', 'সবজি',
    'তরকারি', 'ধানের', 'rice', 'paddy', 'potato', 'jute', 'vegetable', 'crop',
    'yield', 'germination', 'অঙ্কুর',
  ],
}

// "crop_problem" is generic (it mentions the crop name), so a specific topic
// such as irrigation/pest/fertilizer always wins over it.
const SPECIFIC = ['pest', 'fertilizer', 'irrigation']

export function classify(question) {
  const text = String(question || '').toLowerCase()
  const scores = {}
  for (const [topic, words] of Object.entries(TOPICS)) {
    scores[topic] = words.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0)
  }

  const pick = (topics) => {
    let best = topics[0]
    for (const topic of topics) {
      if (scores[topic] > scores[best]) best = topic
    }
    return best
  }

  const specificHit = SPECIFIC.some((t) => scores[t] > 0)
  let best
  if (specificHit) best = pick(SPECIFIC)
  else if (scores.crop_problem > 0) best = 'crop_problem'
  else best = 'general'

  return {
    category: best,
    scores,
    method: 'keyword-rules-v1',
  }
}

// Optional live weather (OpenWeatherMap). If no API key is configured the
// endpoint returns clearly-labelled DEMO data — the UI shows that label, so the
// app never pretends demo numbers are live.
const DEMO = {
  live: false,
  demo_note: 'ডেমো তথ্য — কোনো আবহাওয়া সেবা কনফিগার করা নেই (WEATHER_API_KEY খালি)।',
  data: {
    place: 'বারাসাত, পশ্চিমবঙ্গ (ডেমো)',
    temp_c: 31,
    humidity: 78,
    rain_chance: 60,
    wind_kph: 12,
    condition: 'আংশিক মেঘলা — বৃষ্টির সম্ভাবনা (ডেমো)',
    advice_bn: 'বৃষ্টির সম্ভাবনা থাকলে সার বা স্প্রে আজ করবেন না।',
  },
}

export async function getWeather(config, fetchImpl = fetch) {
  if (!config.weather.apiKey) return DEMO
  const url =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    encodeURIComponent(config.weather.place) +
    '&appid=' +
    encodeURIComponent(config.weather.apiKey) +
    '&units=metric'
  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const d = await res.json()
    return {
      live: true,
      demo_note: null,
      data: {
        place: d?.name || config.weather.place,
        temp_c: d?.main?.temp,
        humidity: d?.main?.humidity,
        rain_chance: d?.clouds?.all ?? null,
        wind_kph: d?.wind?.speed ? Math.round(d.wind.speed * 3.6) : null,
        condition: d?.weather?.[0]?.description || '-',
        advice_bn:
          d?.weather?.[0]?.main === 'Rain'
            ? 'এখন বৃষ্টি হচ্ছে — সার/স্প্রে এড়িয়ে চলুন।'
            : 'শুকনো দিনে স্প্রে করলে ভালো ফল পাবেন।',
      },
    }
  } catch {
    return {
      live: false,
      demo_note: 'আবহাওয়া সেবা পাওয়া যায়নি — নিচের তথ্য ডেমো।',
      data: DEMO.data,
    }
  }
}

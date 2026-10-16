import { WEATHER } from '../lib/mockAgent.js'

export default function WeatherCard() {
  return (
    <div className="card weather">
      <div className="card-title">
        আবহাওয়া টুল <span className="tag">weather_service</span>
      </div>
      <div className="weather-main">
        <span className="weather-icon">🌤️</span>
        <div>
          <div className="weather-temp">{WEATHER.tempC}°C</div>
          <div className="weather-cond">{WEATHER.condition}</div>
        </div>
      </div>
      <div className="weather-grid">
        <div>
          <span>আর্দ্রতা</span>
          <strong>{WEATHER.humidity}%</strong>
        </div>
        <div>
          <span>বৃষ্টি</span>
          <strong>{WEATHER.rainChance}%</strong>
        </div>
        <div>
          <span>বাতাস</span>
          <strong>{WEATHER.windKph} কিমি/ঘ</strong>
        </div>
      </div>
      <div className="weather-place">
        {WEATHER.place} · {WEATHER.updated}
      </div>
    </div>
  )
}

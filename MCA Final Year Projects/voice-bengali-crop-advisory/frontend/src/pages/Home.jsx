import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="stack">
      <section className="hero card">
        <h2>বাংলায় ফসলের প্রাথমিক পরামর্শ — সহজে</h2>
        <p>
          পশ্চিমবঙ্গের বাংলাভাষী চাষিদের জন্য তৈরি এই সহায়ক অ্যাপে আপনি বাংলা বা ইংরেজিতে লিখে
          প্রশ্ন করতে পারেন। সিস্টেম প্রশ্নের ধরন বুঝে, ছোট জ্ঞানভাণ্ডার থেকে সংশ্লিষ্ট তথ্য তুলে
          এনে উত্তর দেয় — এবং কোথায় নিশ্চিত নয় সেটাও স্পষ্ট করে বলে।
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/ask">
            পরামর্শ নিন
          </Link>
          <Link className="btn" to="/guide">
            ফসল নির্দেশিকা দেখুন
          </Link>
        </div>
        <p className="caution">
          সতর্কতা: এটি প্রথম-স্তরের তথ্য সহায়তা। কীটনাশকের মাত্রা বা রোগ নির্ণয়ের জন্য সবসময়
          যোগ্য কৃষি বিশেষজ্ঞের পরামর্শ নিন।
        </p>
      </section>

      <section className="grid-3">
        <article className="card">
          <h3>প্রশ্ন করুন</h3>
          <p>বাংলায় লিখে জিজ্ঞাসা করুন — ধানের পানি, পাতার রোগ, সার, আলু ইত্যাদি।</p>
          <Link to="/ask">যান →</Link>
        </article>
        <article className="card">
          <h3>ফসল নির্দেশিকা</h3>
          <p>ধান, আলু, পাট, সবজি — সার্চ করে সাধারণ পরিচর্যার তথ্য পড়ুন (ডেমো কনটেন্ট)।</p>
          <Link to="/guide">যান →</Link>
        </article>
        <article className="card">
          <h3>আবহাওয়া</h3>
          <p>আজকের আবহাওয়া ও সেচ/স্প্রে সম্পর্কে সাধারণ সতর্কতা (ডেমো তথ্য)।</p>
          <Link to="/weather">যান →</Link>
        </article>
      </section>
    </div>
  )
}

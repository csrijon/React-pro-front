import habitimage from "../assets/habittracker.png"
import resume from "../assets/resumecheker.png"
import chatbot from "../assets/chatbot.png"
import realtime from "../assets/realtimehat.png"
import ytfetch from "../assets/yt fetch.png"
import onlinecompiler from "../assets/onliencompiler.png"
import oto from "../assets/oto.png"
import gdg from "../assets/gdg.png"
import currency from "../assets/currency.png"
import weather from "../assets/weather.png"

export const completeApps = [
  {
    image: habitimage,
    tags: ['HTML', 'SCSS', 'Python', 'Flask'],
    title: 'Habit Tracker',
    description: 'You Can Add Your Daily Habbit and Check EveryDay',
    buttons: [
      { text: 'live', link: '#' },
      { text: 'Github', link: 'https://github.com/csrijon/Express-Pro/tree/main/Habit%20Tracker%20Api' },
    ],
  },
  {
    image: resume,
    tags: ['CSS', 'Express', 'Node.js'],
    title: 'Resume Checker & Builder',
    description: 'Upload Your Resume Ai Automatic Give Your Resume ATS Score',
    buttons: [{ text: 'Github', link: 'https://github.com/csrijon/ats-resume' }],
  },
  {
    image: chatbot,
    tags: ['HTML', 'CSS', 'Express', 'API', 'Node.js'],
    title: 'ChatBot AI',
    description: 'Chat With Bot',
    buttons: [{ text: 'Github', link: 'https://github.com/csrijon/chat-bot' }],
  },
  {
    image: realtime,
    tags: ['HTML', 'CSS', 'Express Js', 'Node.js'],
    title: 'RealTime Chat Application',
    description: 'Realtime Chat Application',
    buttons: [{ text: 'Github', link: 'https://github.com/csrijon/Express-Pro/tree/main/Real%20Time%20Chat%20Application' }],
  },
  {
    image: ytfetch,
    tags: ['React', 'Express', 'Node.js'],
    title: 'Youtube Video and Audio Downloader',
    description: 'You Can Download Any Youtube Video Locally ',
    buttons: [{ text: 'Github', link: 'https://github.com/csrijon/Youtube-video-audio-Downloader' }],
  },
  {
    image: onlinecompiler,
    tags: ['React', 'Express', 'Node.js'],
    title: 'Online Compiler With Multiple Languages',
    description: "It's Online Compiler Powered By AI(API).You Can Run 50+ Languages",
    buttons: [{ text: 'Github', link: 'https://github.com/csrijon/Compiler' }],
  }
];

export const smallProjects = [
  {
    image: oto,
    tags: ['React.js'],
    title: 'OTO',
    description: 'It Is My Internship Work',
    buttons: [{ text: 'Github', link: 'https://github.com/csrijon/React-pro-front/tree/main/hpedit' }],
  },
  {
    image: gdg,
    tags: ['HTML', 'CSS', 'JS'],
    title: 'Google Developer Group Website',
    description: 'Front-end of my future blog created with vuex in vue',
    buttons: [{ text: 'Github', link: 'https://github.com/csrijon/gdg' }],
  },
  {
    image: currency,
    tags: ['HTML', "CSS", "JS"],
    title: 'Currency Converter Website',
    description: 'It is Using Convert Currency Price',
    buttons: [{ text: 'Github', link: '#' }],
  },
  {
    image: weather,
    tags: ['HTML', 'CSS', 'JS'],
    title: 'Weather Web',
    description: 'This is Weather Frontend APplication You Can Check Weather Report.It is Uisng Weather APi',
    buttons: [{ text: 'Github', link: '#' }],
  },
];
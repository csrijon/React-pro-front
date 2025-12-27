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
    image: habitimage, // Placeholder for ChertNodes
    tags: ['HTML', 'SCSS', 'Python', 'Flask'],
    title: 'Habit Tracker',
    description: 'Minecraft Servers hosting',
    buttons: [
      { text: 'live', link: '#' },
      { text: 'cached', link: '#' },
    ],
  },
  {
    image: resume, // Placeholder for Kahoot Answers
    tags: ['CSS', 'Express', 'Node.js'],
    title: 'Resume Checker & Builder',
    description: 'Get answers to your kahoot quiz',
    buttons: [{ text: 'live', link: '#' }],
  },
  {
    image: chatbot, // Placeholder for ProtectX
    tags: ['HTML','CSS','Express','API','Node.js'],
    title: 'ChatBot AI',
    description: 'Discord anti-crash bot',
    buttons: [{ text: 'Github', link: '#' }],
  },
  {
    image: realtime, // Placeholder for ProtectX
    tags: ['HTML','CSS','Express Js','Node.js'],
    title: 'ProtectX',
    description: 'Discord anti-crash bot',
    buttons: [{ text: 'Github', link: '#' }],
  },
  {
    image: ytfetch, 
    tags: ['React', 'Express', 'Node.js'],
    title: 'Youtube Video and Audio Downloader',
    description: 'Discord anti-crash bot',
    buttons: [{ text: 'Github', link: '#' }],
  },
  {
    image: onlinecompiler, 
    tags: ['React', 'Express','Node.js'],
    title: 'Online Compiler With Multiple Languages',
    description: 'Discord anti-crash bot',
    buttons: [{ text: 'Github', link: '#' }],
  }
];

export const smallProjects = [
    {
        image: oto, 
        tags: ['Discord.js', 'TS', 'JS'],
        title: 'Bot boilerplate',
        description: 'Start creating scalable discord bots with typescript in seconds',
        buttons: [{ text: 'Github', link: '#' }],
      },
      {
        image: gdg,
        tags: ['Vue', 'CSS', 'JS'],
        title: 'My blog',
        description: 'Front-end of my future blog created with vuex in vue',
        buttons: [{ text: 'Github', link: '#' }],
      },
      {
        image: currency,
        tags: ['Figma'],
        title: 'Chess pro',
        description: 'Figma landing page about service for viewing chess tournaments',
        buttons: [{ text: 'Github', link: '#' }],
      },
      {
        image: weather,
        tags: ['Figma'],
        title: 'Chess pro',
        description: 'Figma landing page about service for viewing chess tournaments',
        buttons: [{ text: 'Github', link: '#' }],
      },
];
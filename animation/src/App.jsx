import React from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
    <motion.div initial={{ opacity: 0, filter: "blur(10px)",scale:0 }} animate={{ opacity: 5, filter: "blur(0px)", scale:1 }} whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} className='container' >
    </motion.div>
  );
}

export default App;
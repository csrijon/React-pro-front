import React from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
    <div className="container">
      <section className="spacer">
        <h1>Scroll Down to See the Animation</h1>
      </section>
      
      {/* This is our animated element */}
      <motion.div
        className="box"

        // 1. Initial State: Hidden and below its final position
        initial={{ opacity: 0, y: 100 }}

        // 2. Animate To: Fully visible and in its final position
        whileInView={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.9 }}

        // 3. Transition: The bounce effect
        transition={{
          type: "spring",
          bounce: 0.4,
          duration: 0.8
        }}

        // 4. Viewport Settings: Animate only once
        viewport={{ once: true }}
      >
        <h2>Bounce In!</h2>
      </motion.div>

      <section className="spacer"></section>
    </div>
  );
}

export default App;
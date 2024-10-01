import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => (
  <motion.section
    id="home"
    className="bg-indigo-600 text-white py-20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-4"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        Kamisetti Ramanjaneyulu
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl mb-8"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
      >
        Web Developer | React.js Specialist | Firebase Expert
      </motion.p>
      <motion.a
        href="#contact"
        className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-100 transition duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get in Touch
      </motion.a>
    </div>
  </motion.section>
);

export default Hero;
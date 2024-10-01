import React from 'react';
import { motion } from 'framer-motion';

const About = () => (
  <motion.section
    id="about"
    className="py-20 bg-white"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2
        className="text-3xl font-bold mb-8 text-center text-indigo-600"
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        viewport={{ once: true }}
      >
        About Me
      </motion.h2>
      <motion.div
        className="text-lg mb-4 text-gray-700"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p className="mb-4">
          I'm a passionate web developer with expertise in React.js, Firebase, and creating stunning user interfaces. My goal is to succeed in an environment of growth and excellence, utilizing my skills and knowledge to contribute positively to both my personal growth and the growth of the organization.
        </p>
        <p>
          With a strong foundation in Data Science from Madanapalle Institute of Technology and Science (CGPA: 8.27/10), I bring a unique perspective to web development, combining data-driven insights with cutting-edge front-end technologies.
        </p>
      </motion.div>
    </div>
  </motion.section>
);

export default About;
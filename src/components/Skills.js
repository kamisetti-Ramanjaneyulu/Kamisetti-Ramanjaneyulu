import React from 'react';
import { motion } from 'framer-motion';

const skillsData = [
  { category: "Programming Languages", skills: ["Python", "JavaScript"] },
  { category: "Machine Learning/Deep Learning", skills: ["TensorFlow", "NumPy", "Pandas", "Matplotlib"] },
  { category: "Web Development", skills: ["HTML5", "CSS", "JavaScript", "React.js", "Firebase"] },
  { category: "Database", skills: ["SQL", "MySQL"] },
  { category: "Tools", skills: ["Git", "Visual Studio Code"] },
];

const Skills = () => (
  <motion.section
    id="skills"
    className="py-20 bg-gray-100"
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
        Technical Skills
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillsData.map((skillGroup, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * index, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">{skillGroup.category}</h3>
            <div className="flex flex-wrap">
              {skillGroup.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-indigo-600 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default Skills;
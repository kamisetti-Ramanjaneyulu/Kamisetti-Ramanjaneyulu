import React from 'react';
import { motion } from 'framer-motion';

const experienceData = [
  {
    title: "Web Developer Intern",
    company: "Ravuru Tech Pvt Ltd",
    period: "May 2024 - Present",
    responsibilities: [
      "Developing React.js web applications with Firebase backend, optimizing performance",
      "Led development of AitGiant, a learning management system",
      "Designed and developed the official website for TrancheTechTre using React.js, Tailwind CSS, and Firebase, ensuring a modern UI, seamless user experience, and cross-device responsiveness"
    ]
  },
  {
    title: "Machine Learning Intern",
    company: "NIT Puducherry",
    period: "Jan 2024 - Apr 2024",
    responsibilities: [
      "Led skin disease classification project achieving 96% accuracy with Inception v3",
      "Published in IEEE Xplore: \"Multi-Class Skin Disease Classification\" (2024)",
      "Implemented advanced CNNs for 23-class problem using 15,000-image dataset",
      "Demonstrated expertise in deep learning, image processing, and scientific research methodologies"
    ]
  }
];

const Experience = () => (
  <motion.section
    id="experience"
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
        Professional Experience
      </motion.h2>
      <div className="space-y-12">
        {experienceData.map((job, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * index, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">{job.title}</h3>
            <p className="text-gray-600 mb-2">{job.company}</p>
            <p className="text-gray-500 mb-4">{job.period}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.responsibilities.map((responsibility, idx) => (
                <li key={idx}>{responsibility}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default Experience;
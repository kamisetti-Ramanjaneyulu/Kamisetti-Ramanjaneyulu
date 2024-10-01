import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const projectsData = [
  {
    title: "Multi-Class Skin Disease Classification System",
    description: "Pioneered CNN-based system for early detection of 23 skin diseases, achieving 96% accuracy with Inception v3. Implemented and benchmarked InceptionV3, MobileNet, and ResNet on 15,000-image dataset.",
    technologies: ["Python", "TensorFlow", "CNN", "Transfer Learning"],
    github: "https://github.com/yourusername/skin-disease-classification",
    live: "https://ieeexplore.ieee.org/document/your-paper-id"
  },
  {
    title: "AitGiant - Learning Management System",
    description: "Led the development of a comprehensive learning management system using React.js and Firebase, optimizing performance and user experience.",
    technologies: ["React.js", "Firebase", "Tailwind CSS"],
    github: "https://github.com/yourusername/aitgiant-lms",
    live: "https://aitgiant.com"
  },
  {
    title: "TrancheTechTre Official Website",
    description: "Designed and developed the official website using React.js, Tailwind CSS, and Firebase, ensuring a modern UI, seamless user experience, and cross-device responsiveness.",
    technologies: ["React.js", "Tailwind CSS", "Firebase"],
    github: "https://github.com/yourusername/tranchetech-website",
    live: "https://tranchetech.com"
  }
];

const Projects = () => (
  <motion.section
    id="projects"
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
        Projects
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * index, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">{project.title}</h3>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="mb-4">
                {project.technologies.map((tech, idx) => (
                  <span
                  key={idx}
                  className="inline-block bg-indigo-100 text-indigo-600 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex justify-between">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
              >
                <FaGithub className="inline mr-2" />
                GitHub
              </a>
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
              >
                <FaExternalLinkAlt className="inline mr-2" />
                Live Demo
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>
);

export default Projects;
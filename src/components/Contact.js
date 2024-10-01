import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission, e.g., sending an email or storing the message
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
    alert('Thank you for your message! I will get back to you soon.');
  };

  return (
    <motion.section
      id="contact"
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
          Get in Touch
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-gray-100 p-6 rounded-lg shadow-md"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Contact Information</h3>
            <p className="mb-4">Feel free to reach out to me through any of the following channels:</p>
            <div className="flex items-center mb-2">
              <FaEnvelope className="text-indigo-600 mr-2" />
              <a href="mailto:kamisettyram321@gmail.com" className="text-indigo-600 hover:underline">
                kamisettyram321@gmail.com
              </a>
            </div>
            <div className="flex items-center mb-2">
              <FaLinkedin className="text-indigo-600 mr-2" />
              <a href="https://www.linkedin.com/in/kamisetti-ramanjaneyulu/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                LinkedIn Profile
              </a>
            </div>
            <div className="flex items-center">
              <FaGithub className="text-indigo-600 mr-2" />
              <a href="https://github.com/kamisetti-Ramanjaneyulu" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                GitHub Profile
              </a>
            </div>
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-6 rounded-lg shadow-md"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
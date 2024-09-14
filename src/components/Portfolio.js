import React, { useState, useEffect } from 'react';
import { Code, Linkedin, Mail, Phone, ExternalLink, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom Alert Component
const Alert = ({ children, className }) => (
  <div className={`bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 ${className}`} role="alert">
    {children}
  </div>
);

const AlertTitle = ({ children }) => <h3 className="font-bold">{children}</h3>;
const AlertDescription = ({ children }) => <p>{children}</p>;

// Custom Card Component
const Card = ({ children, className }) => (
  <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="px-6 py-4">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-xl font-bold ${className}`}>{children}</h3>;
const CardDescription = ({ children }) => <p className="text-gray-600">{children}</p>;
const CardContent = ({ children }) => <div className="px-6 py-4">{children}</div>;
const CardFooter = ({ children }) => <div className="px-6 py-4 bg-gray-100">{children}</div>;

const SkillBadge = ({ skill }) => (
  <motion.div 
    className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300 transition-colors duration-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {skill}
  </motion.div>
);

const Project = ({ title, description, tags, link }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card className="h-full transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 dark:text-gray-300">{description}</CardDescription>
        <div className="flex flex-wrap gap-2 mb-4 mt-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-indigo-700 dark:text-indigo-100 transition-colors duration-300 hover:bg-indigo-200 dark:hover:bg-indigo-600">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors duration-300 flex items-center group">
            View Project <ExternalLink size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        ) : (
          <span className="text-gray-500 italic">Link not available</span>
        )}
      </CardFooter>
    </Card>
  </motion.div>
);
const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: entry.isIntersecting }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">Ashritha Ankola</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['about', 'experience', 'projects', 'skills', 'education'].map((section) => (
                  <motion.button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`${
                      activeSection === section
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-300 hover:bg-indigo-500 hover:text-white'
                    } px-3 py-2 rounded-md text-sm font-medium capitalize transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {section}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <motion.header 
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Ashritha Ankola
          </motion.h1>
          <motion.p 
            className="text-2xl mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Full Stack Web Developer
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.a 
              href="mailto:Ashritha.ankola236@gmail.com" 
              className="flex items-center bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-indigo-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={20} className="mr-2" /> Email
            </motion.a>
            <motion.a 
              href="tel:+916281456359" 
              className="flex items-center bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-indigo-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={20} className="mr-2" /> Phone
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/in/ashritha-ankola-14670724a/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-indigo-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin size={20} className="mr-2" /> LinkedIn
            </motion.a>
            <motion.a 
              href="https://github.com/AshrithaAnkola" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-indigo-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Code size={20} className="mr-2" /> GitHub
            </motion.a>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.section 
          id="about" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.about ? 1 : 0, y: isVisible.about ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">About Me</h2>
          <Alert className="mb-6">
            <AlertTitle>Welcome to my portfolio!</AlertTitle>
            <AlertDescription>
              I'm a motivated and detail-oriented Computer Science graduate with a strong foundation in full-stack web development. 
              My goal is to leverage my technical skills and internship experience in a professional environment, contributing to 
              organizational goals while fostering personal growth.
            </AlertDescription>
          </Alert>
          <p className="text-lg text-center leading-relaxed">
            With a passion for creating efficient and user-friendly web applications, I strive to stay up-to-date with the latest 
            technologies and best practices in the ever-evolving field of web development.
          </p>
          <div className="mt-6 text-center">
            <p className="text-lg flex items-center justify-center">
              <Calendar size={20} className="mr-2" /> Born on December 11, 2001
            </p>
          </div>
        </motion.section>


        <motion.section 
          id="experience" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.experience ? 1 : 0, y: isVisible.experience ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Work Experience</h2>
          <div className="space-y-8">
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Full Stack Web Developer</CardTitle>
                <CardDescription>MARKATLAS INKJET TECHNOLOGIES PVT LTD. | June 2024 - Present</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Developing and maintaining real-time projects using ReactJS, Firebase, and Tailwind CSS</li>
                  <li>Collaborating with cross-functional teams to implement new features and improve existing functionality</li>
                  <li>Optimizing application performance and ensuring responsive design across various devices</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Web Development Intern</CardTitle>
                <CardDescription>INNOMATICS RESEARCH LABS | February 2023 - August 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Completed comprehensive training in web development, progressing from basic to advanced concepts</li>
                  <li>Gained hands-on experience in developing dynamic web pages using modern technologies</li>
                  <li>Participated in team projects, enhancing collaboration and communication skills</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section 
          id="projects" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.projects ? 1 : 0, y: isVisible.projects ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Project 
              title="Employee Management System (EMS)"
              description="Full-stack application using HTML, Tailwind CSS, ReactJS, and Firebase with CRUD operations for efficient employee data management."
              tags={['React', 'Firebase', 'Tailwind CSS']}
              link="https://employee-managment-one.vercel.app/"
            />
            <Project 
              title="API Integration in ReactJS"
              description="Web application demonstrating proficiency in API integration using React, showcasing dynamic data fetching and state management."
              tags={['React', 'API Integration', 'JavaScript']}
              link="https://startling-belekoy-ca26c9.netlify.app/"
            />
            <Project 
              title="ENGYAAN - Engage in Learning"
              description="E-learning platform using ReactJS for front-end and NodeJS for back-end with user authentication and course management features."
              tags={['React', 'Node.js', 'Express']}
              link={null}
            />
            <Project 
              title="Face Recognition from Dataframes Using ML"
              description="Implemented a machine learning model for facial recognition using Python and IDLE-Python for development and testing."
              tags={['Python', 'Machine Learning']}
              link={null}
            />
          </div>
        </motion.section>

        <motion.section 
          id="skills" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.skills ? 1 : 0, y: isVisible.skills ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'JavaScript', 'ReactJS', 'Node.js', 'HTML5/CSS3', 'Firebase', 'Tailwind CSS'].map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Team Collaboration', 'Problem Solving', 'Communication', 'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity'].map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="education" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.education ? 1 : 0, y: isVisible.education ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Education</h2>
          <div className="space-y-8">
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Bachelor of Technology (CSE)</CardTitle>
                <CardDescription>JNTUH University College of Engineering, Manthani | 2019 - 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">CGPA: 7.39</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Intermediate</CardTitle>
                <CardDescription>Narayana Junior College, Hyderabad | 2017 - 2019</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Percentage: 96.10%</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Matriculation</CardTitle>
                <CardDescription>Emily The School, Hyderabad | 2016 - 2017</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">CGPA: 9.2</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section 
          id="certifications" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.certifications ? 1 : 0, y: isVisible.certifications ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Python</CardTitle>
                <CardDescription>PREPINSTA</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Comprehensive course covering Python fundamentals and advanced concepts.</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Web Development</CardTitle>
                <CardDescription>PREPINSTA</CardDescription>
              </CardHeader>
              <CardContent>
                <p>In-depth training on modern web development technologies and practices.</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section 
          id="interests" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.interests ? 1 : 0, y: isVisible.interests ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Interests</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Music Appreciation', 'Travel and Exploration', 'Competitive Gaming'].map((interest, index) => (
              <motion.span 
                key={index} 
                className="bg-blue-100 text-blue-800 text-lg font-semibold px-4 py-2 rounded-full dark:bg-blue-200 dark:text-blue-800 transition-all duration-300 hover:bg-blue-200 hover:scale-105"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </motion.section>
        </main>

<footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p className="text-2xl font-bold mb-4">&copy; 2024 Ashritha Ankola. All rights reserved.</p>
    <p className="mb-6">Created with React, Tailwind CSS, and ❤️</p>
    <div className="flex justify-center space-x-6">
    <motion.a 
              href="mailto:Ashritha.ankola236@gmail.com" 
              className="hover:text-indigo-200 transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <Mail size={24} />
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/in/ashritha-ankola-14670724a/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-200 transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a 
              href="https://github.com/AshrithaAnkola" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-200 transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <Code size={24} />
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
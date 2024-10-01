import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { Code, Linkedin, Mail, Phone, ExternalLink, Calendar, Github, Award, Book, Briefcase, Moon, Sun, ChevronRight, MapPin, Download, Menu, X, ArrowRight } from 'lucide-react';
let GitHub = Github;

// Particle effect component
const Particles = ({ theme }) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    setParticles(Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1
    })));
  }, []);

  useAnimationFrame(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';

    particles.forEach((particle, i) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > height) particle.speedY *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = theme === 'dark' ? `rgba(255, 255, 255, ${0.2 - distance / 500})` : `rgba(0, 0, 0, ${0.2 - distance / 500})`;
          ctx.stroke();
        }
      });
    });

    setParticles(particles);
  });

  return <canvas ref={ref} width={width} height={height} className="absolute inset-0 z-0" />;
};

// Animated text component
const AnimatedText = ({ text, className = "" }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.h1 
      className={`${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// Custom cursor component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-500 pointer-events-none z-50"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    />
  );
};

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState({});
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effect for hero section
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: entry.isIntersecting }));
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Your existing data objects here (experienceData, projectsData, etc.)
  const experienceData = [
    {
      title: "Web Developer Intern",
      company: "Ravuru Tech Pvt Ltd",
      date: "May 2024 - Present",
      points: [
        "Developing React.js web applications with Firebase backend, optimizing performance",
        "Led development of AitGiant, a learning management system",
        "Designed and developed the official website for TrancheTechTre using React.js, Tailwind CSS, and Firebase"
      ]
    },
    {
      title: "Machine Learning Intern",
      company: "NIT Puducherry",
      date: "Jan 2024 - Apr 2024",
      points: [
        "Led skin disease classification project achieving 96% accuracy with Inception v3",
        "Published in IEEE Xplore: 'Multi-Class Skin Disease Classification' (2024)",
        "Implemented advanced CNNs for 23-class problem using 15,000-image dataset"
      ]
    }
  ];

  const projectsData = [
    {
      title: "Multi-Class Skin Disease Classification System",
      description: "Pioneered CNN-based system for early detection of 23 skin diseases, achieving 96% accuracy with Inception v3.",
      techStack: ["Python", "TensorFlow", "CNN", "Deep Learning"],
      link: "https://ieeexplore.ieee.org/document/10627847"
    },
    {
      title: "Personal Portfolio Website",
      description: "Crafted responsive portfolio using modern web technologies, optimized for performance.",
      techStack: ["React", "Tailwind CSS", "Framer Motion", "Firebase"],
      link: "#"
    }
  ];

  const skillsData = {
    "Programming Languages": ["Python", "JavaScript"],
    "Machine Learning/Deep Learning": ["TensorFlow", "NumPy", "Pandas", "Matplotlib"],
    "Web Development": ["HTML5", "CSS", "JavaScript", "React.js", "Firebase"],
    "Database": ["SQL", "MySQL"],
    "Tools": ["Git", "Visual Studio Code"]
  };

  const educationData = {
    degree: "B.Tech in Data Science",
    institution: "Madanapalle Institute of Technology and Science",
    duration: "2020 - 2024",
    cgpa: "8.27/10"
  };

  const certifications = [
    {
      title: "Introduction to Front-end Development",
      issuer: "Meta, Coursera",
      link: "https://www.coursera.org/account/accomplishments/verify/9EJ84XS4DX69?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course"
    },
    {
      title: "Programming with JavaScript Certification",
      issuer: "Meta, Coursera",
      link: "https://www.coursera.org/account/accomplishments/verify/UF52CZCF377Y?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course"
    },
    {
      title: "Version Control Certification",
      issuer: "Meta, Coursera",
      link: "https://www.coursera.org/account/accomplishments/verify/YBLZWC2TDZY6?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course"
    }
  ];

  const navItems = ['Home', 'about', 'experience', 'projects', 'skills', 'education', 'contact'];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200' : 'bg-gradient-to-br from-gray-100 to-indigo-50 text-gray-800'} transition-colors duration-500`}>
      <CustomCursor />
      <Particles theme={theme} />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <nav className={`${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-md shadow-lg fixed w-full z-40 transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.span 
              className={`font-bold text-xl ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              K.R
            </motion.span>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((section) => (
                <motion.button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`${
                    activeSection === section
                      ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-indigo-500 text-white'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-blue-700/50 hover:text-white' : 'text-gray-600 hover:bg-indigo-500/50 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium capitalize transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {section}
                </motion.button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              
              <motion.button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-x-0 top-16 z-30 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg md:hidden`}
          >
            {navItems.map((section) => (
              <motion.button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`w-full text-left px-4 py-3 block ${
                  activeSection === section
                    ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-indigo-500 text-white'
                    : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
                whileHover={{ x: 10 }}
              >
                {section}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
      <motion.header 
  ref={heroRef}
  id="hero"
  className={`relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} text-white pt-24 pb-16 px-4 sm:px-8 lg:px-8 sm:pt-32 sm:pb-20`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8 }}
>
  <motion.div
    className="absolute inset-0 overflow-hidden"
    style={{ y }}
  >
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgNjAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik0gNjAgMCBMIDYwIDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
  </motion.div>

  <div className="max-w-4xl mx-auto text-center relative">
    <AnimatedText 
      text="Kamisetti Ramanjaneyulu"
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
    />
    <motion.p 
      className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      Data Scientist & Web Developer
    </motion.p>
    <motion.div 
      className="flex flex-wrap justify-center gap-3 sm:gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      {[
        { icon: Mail, text: 'Email', href: 'mailto:kamisettyram321@gmail.com' },
        { icon: Phone, text: 'Phone', href: 'tel:+919398357367' },
        { icon: Linkedin, text: 'LinkedIn', href: 'https://www.linkedin.com/in/kamisetti-ramanjaneyulu-b86581242/' },
        { icon: GitHub, text: 'GitHub', href: 'https://github.com/kamisetti-Ramanjaneyulu' }
      ].map((item, index) => (
        <motion.a 
          key={item.text}
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={`flex items-center ${theme === 'dark' ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' : 'bg-white text-indigo-600 hover:bg-indigo-100'} px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300`}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 * index }}
        >
          <item.icon size={18} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{item.text}</span>
        </motion.a>
      ))}
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
          <h2 className={`text-4xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>About Me</h2>
          <motion.div 
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-lg text-center leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
              I am a passionate Data Scientist and Web Developer with a strong foundation in machine learning and web technologies. 
              As a recent graduate, I've gained valuable experience through internships, which have honed my skills in both data science and web development.
              My goal is to leverage my technical skills and knowledge to create innovative solutions that make a positive impact. 
              I thrive in environments that encourage growth, creativity, and excellence.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Award className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-500'} mx-auto mb-2`} />
                <p className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>CGPA: 8.27/10</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Academic Excellence</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Book className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-500'} mx-auto mb-2`} />
                <p className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>B.Tech in Data Science</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>2020 - 2024</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Briefcase className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-500'} mx-auto mb-2`} />
                <p className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Internship Experience</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Web Dev & Machine Learning</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section 
          id="experience" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.experience ? 1 : 0, y: isVisible.experience ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-4xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>Experience</h2>
          <div className="space-y-8">
            {experienceData.map((exp, index) => (
              <motion.div 
                key={index}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <h3 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>{exp.title}</h3>
                <div className="flex items-center mb-4">
                  <Briefcase className="mr-2" size={18} />
                  <span className="font-medium">{exp.company}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="mr-2" size={18} />
                  <span>{exp.date}</span>
                </div>
                <ul className="list-disc list-inside space-y-2">
                  {exp.points.map((point, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <ChevronRight className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          id="projects" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.projects ? 1 : 0, y: isVisible.projects ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-4xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsData.map((project, index) => (
              <motion.div 
                key={index}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>{project.title}</h3>
                <p className="mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, i) => (
                    <motion.span 
                      key={i} 
                      className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-indigo-100 text-indigo-800'}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
                <motion.a 
                  href={project.link} 
                  className={`flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-500'}`}
                  whileHover={{ x: 5 }}
                >
                  View Project <ArrowRight className="ml-2" size={16} />
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          id="skills" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.skills ? 1 : 0, y: isVisible.skills ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-4xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skillsData).map(([category, skills], index) => (
              <motion.div 
                key={index}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <motion.span 
                      key={i} 
                      className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-indigo-100 text-indigo-800'}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                    {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          id="education" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.education ? 1 : 0, y: isVisible.education ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-4xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>Education</h2>
          <motion.div 
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>{educationData.degree}</h3>
            <div className="flex items-center mb-2">
              <Book className="mr-2" size={18} />
              <span className="font-medium">{educationData.institution}</span>
            </div>
            <div className="flex items-center mb-2">
              <Calendar className="mr-2" size={18} />
              <span>{educationData.duration}</span>
            </div>
            <div className="flex items-center">
              <Award className="mr-2" size={18} />
              <span>CGPA: {educationData.cgpa}</span>
            </div>
          </motion.div>

          <h3 className={`text-2xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>Certifications</h3>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <motion.div 
                key={index}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-4`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>{cert.title}</h4>
                <div className="flex items-center justify-between">
                  <span>{cert.issuer}</span>
                  <motion.a 
                    href={cert.link} 
                    className={`flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-500'}`}
                    whileHover={{ x: 5 }}
                  >
                    View Certificate <ExternalLink className="ml-2" size={16} />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          id="contact" 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible.contact ? 1 : 0, y: isVisible.contact ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-4xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`}>Contact</h2>
          <motion.div 
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-lg text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              I'm always open to new opportunities and collaborations. Feel free to reach out!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Mail, text: 'kamisettyram321@gmail.com', href: 'mailto:kamisettyram321@gmail.com' },
                { icon: Phone, text: '+91 9398357367', href: 'tel:+919398357367' },
                { icon: Linkedin, text: 'LinkedIn Profile', href: 'https://www.linkedin.com/in/kamisetti-ramanjaneyulu-b86581242/' },
                { icon: GitHub, text: 'GitHub Profile', href: 'https://github.com/kamisetti-Ramanjaneyulu' }
              ].map((item, index) => (
                <motion.a 
                  key={item.text}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center ${theme === 'dark' ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'} px-4 py-2 rounded-full transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon size={20} className="mr-2" />
                  {item.text}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.section>
      </main>

      <motion.footer 
        className={`${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'} py-8`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Kamisetti Ramanjaneyulu. All rights reserved.</p>
          <motion.a 
            href="https://drive.google.com/file/d/13MtCAnGu8pBsQar2WxxpAG8UwFHkj9Sc/view?usp=sharing" 
            className={`inline-block mt-2 ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-500'}`}
            whileHover={{ scale: 1.1 }}
          >
            <Download size={20} className="inline mr-2" />
            Download Resume
          </motion.a>
        </div>
      </motion.footer>
      </AnimatePresence>
    </div>
    
  );
};

export default Portfolio;
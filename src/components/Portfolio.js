import React, { useState, useEffect } from 'react';
import { Code, Linkedin, Mail, Phone, ExternalLink, ChevronDown } from 'lucide-react';

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

const SkillBar = ({ skill, level }) => (
  <div className="mb-6 group">
    <div className="flex justify-between mb-1">
      <span className="text-base font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-500 transition-colors duration-300">{skill}</span>
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-500 transition-colors duration-300">{level}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out transform origin-left scale-x-0 group-hover:scale-x-100" 
        style={{ width: `${level}%` }}
      ></div>
    </div>
  </div>
);

const Project = ({ title, description, tags, link }) => (
  <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 transition-colors duration-300 hover:bg-blue-200">
            {tag}
          </span>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-300 flex items-center group">
          View Project <ExternalLink size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      ) : (
        <span className="text-gray-500 italic">Link not available</span>
      )}
    </CardFooter>
  </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400">Ashritha Ankola</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['about', 'experience', 'projects', 'skills', 'education'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`${
                      activeSection === section
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-blue-500 hover:text-white'
                    } px-3 py-2 rounded-md text-sm font-medium capitalize transition-all duration-300`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-all duration-500 transform hover:scale-[1.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-down">Ashritha Ankola</h1>
          <p className="text-2xl mb-8 animate-fade-in-up">Full Stack Web Developer</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:Ashritha.ankola236@gmail.com" className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-blue-100 hover:scale-105">
              <Mail size={20} className="mr-2" /> Email
            </a>
            <a href="tel:+916281456359" className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-blue-100 hover:scale-105">
              <Phone size={20} className="mr-2" /> Phone
            </a>
            <a href="https://www.linkedin.com/in/ashritha-ankola/" target="_blank" rel="noopener noreferrer" className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-blue-100 hover:scale-105">
              <Linkedin size={20} className="mr-2" /> LinkedIn
            </a>
            <a href="https://github.com/AshrithaAnkola" target="_blank" rel="noopener noreferrer" className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-blue-100 hover:scale-105">
              <Code size={20} className="mr-2" /> GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section id="about" className={`mb-20 transition-all duration-1000 transform ${isVisible.about ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">About Me</h2>
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
        </section>

        <section id="experience" className={`mb-20 transition-all duration-1000 transform ${isVisible.experience ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
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
        </section>

        <section id="projects" className={`mb-20 transition-all duration-1000 transform ${isVisible.projects ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Project 
              title="Employee Management System (EMS)"
              description="Full-stack application using HTML, Tailwind CSS, ReactJS, and Firebase with CRUD operations for efficient employee data management."
              tags={['React', 'Firebase', 'Tailwind CSS']}
              link="https://ems-admin.vercel.app/"
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
              tags={['React', 'Node.js', 'MongoDB']}
              link={null}
            />
            <Project 
              title="Face Recognition from Dataframes Using ML"
              description="Implemented a machine learning model for facial recognition using Python and IDLE-Python for development and testing."
              tags={['Python', 'Machine Learning', 'OpenCV']}
              link={null}
            />
          </div>
        </section>

        <section id="skills" className={`mb-20 transition-all duration-1000 transform ${isVisible.skills ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Technical Skills</h3>
              <SkillBar skill="Python" level={90} />
              <SkillBar skill="JavaScript" level={85} />
              <SkillBar skill="ReactJS" level={80} />
              <SkillBar skill="Node.js" level={75} />
              <SkillBar skill="HTML5/CSS3" level={95} />
              <SkillBar skill="Firebase" level={85} />
              <SkillBar skill="Tailwind CSS" level={90} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Soft Skills</h3>
              <SkillBar skill="Team Collaboration" level={90} />
              <SkillBar skill="Problem Solving" level={85} />
              <SkillBar skill="Communication" level={80} />
              <SkillBar skill="Time Management" level={85} />
              <SkillBar skill="Adaptability" level={80} />
              <SkillBar skill="Critical Thinking" level={85} />
              <SkillBar skill="Creativity" level={75} />
            </div>
          </div>
        </section>

        <section id="education" className={`mb-20 transition-all duration-1000 transform ${isVisible.education ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
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
        </section>

        <section id="certifications" className={`mb-20 transition-all duration-1000 transform ${isVisible.certifications ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
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
        </section>

        <section id="interests" className={`mb-20 transition-all duration-1000 transform ${isVisible.interests ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Interests</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Music Appreciation', 'Travel and Exploration', 'Competitive Gaming'].map((interest, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-lg font-semibold px-4 py-2 rounded-full dark:bg-blue-200 dark:text-blue-800 transition-all duration-300 hover:bg-blue-200 hover:scale-105">
                {interest}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl font-bold mb-4">&copy; 2024 Ashritha Ankola. All rights reserved.</p>
          <p className="mb-6">Created with React, Tailwind CSS, and ❤️</p>
          <div className="flex justify-center space-x-6">
            <a href="mailto:Ashritha.ankola236@gmail.com" className="hover:text-blue-200 transition-colors duration-300">
              <Mail size={24} />
            </a>
            <a href="https://www.linkedin.com/in/ashritha-ankola/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors duration-300">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/AshrithaAnkola" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors duration-300">
              <Code size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
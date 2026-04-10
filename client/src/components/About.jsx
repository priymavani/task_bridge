import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "../style/About.css";
import { LayoutDashboard, MessageSquare, Calendar, FileText, Presentation, Video } from "lucide-react";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, offset: 100 });
  }, []);

  return (
    <div className="about-container">
      {/* Hero Section */}
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <h1>Welcome to Task Bridge</h1>
        <p>Your ultimate project management and issue-tracking solution.</p>
      </motion.div>

      {/* Section 1: Introduction */}
      <section className="about-section" data-aos="fade-up">
        <h2>What is Task Bridge?</h2>
        <p>
          Task Bridge is an innovative project management platform designed to 
          enhance team collaboration and streamline project tracking. Whether you're 
          working on software development, content creation, or any team-based 
          project, Task Bridge provides a structured and intuitive environment 
          for seamless productivity.
        </p>
      </section>

      {/* Section 2: Key Features */}
      <section className="about-section features-section" data-aos="fade-right">
        <h2 className="why_choose">Why Choose Task Bridge?</h2>
        <div className="feature-grid">
          <motion.div className="feature-card" whileHover={{ scale: 1.1 }}>
            <h3><LayoutDashboard size={20} style={{ display: 'inline', marginRight: '6px' }} /> Task Management</h3>
            <p>Efficiently create, assign, and track tasks with real-time updates.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ scale: 1.1 }}>
            <h3><MessageSquare size={20} style={{ display: 'inline', marginRight: '6px' }} /> Team Collaboration</h3>
            <p>Communicate seamlessly with team members through built-in messaging.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ scale: 1.1 }}>
            <h3><Calendar size={20} style={{ display: 'inline', marginRight: '6px' }} /> Calendar Integration</h3>
            <p>Stay on top of deadlines with an interactive project calendar.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ scale: 1.1 }}>
            <h3><FileText size={20} style={{ display: 'inline', marginRight: '6px' }} /> File Sharing</h3>
            <p>Upload and manage project-related documents in one central location.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ scale: 1.1 }}>
            <h3><Presentation size={20} style={{ display: 'inline', marginRight: '6px' }} /> Virtual Board</h3>
            <p>Collaborate visually with a real-time interactive whiteboard.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ scale: 1.1 }}>
            <h3><Video size={20} style={{ display: 'inline', marginRight: '6px' }} /> Video Conferencing</h3>
            <p>Set up meetings, take notes, and record sessions—all within the platform.</p>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Mission and Vision */}
      <section className="about-section mission-section" data-aos="fade-left">
        <h2>Our Mission & Vision</h2>
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          At Task Bridge, our mission is to redefine the way teams work together. 
          We envision a world where project management is **simpler, smarter, and 
          more intuitive**—enabling teams to focus on what truly matters: 
          achieving their goals.
        </motion.p>
      </section>

      {/* Section 4: Get Started */}
      <section className="about-section get-started-section" data-aos="zoom-in">
        <h2>Ready to Elevate Your Workflow?</h2>
        <p>Join Task Bridge today and **experience seamless collaboration like never before!</p>
        <motion.button 
          className="cta-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Get Started Now
        </motion.button>
      </section>
    </div>
  );
};

export default About;

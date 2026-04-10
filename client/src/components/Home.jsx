import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Users, UserPlus, Presentation, 
  CheckSquare, MessageSquare, FileText, 
  Star, Quote, ArrowRight
} from 'lucide-react';

import homeImage from '../assets/home_i.png';
import logo from '../assets/Logo.png';

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <HomeContainer>
      {/* Subtle modern background grid */}
      <BackgroundGrid style={{ y: yPos }} />
      
      <HomeContent>
        {/* HERO SECTION */}
        <HeroSection as={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
          <HeroGrid>
            <HeroText variants={containerVariants}>
              <motion.img 
                src={logo} 
                alt="Task Bridge Logo" 
                className="logo"
                variants={itemVariants}
                style={{ width: '80px', marginBottom: '2rem', filter: 'drop-shadow(0 4px 6px rgba(101,131,252,0.2))' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              <Title variants={itemVariants}>
                Manage your work. <br /> <GradientText>Empower your team.</GradientText>
              </Title>
              <Subtitle variants={itemVariants}>
                Task Bridge is the unified workspace that brings your team's tasks, meetings, and documents into one seamless, elegant experience.
              </Subtitle>
              
              <ButtonGroup variants={itemVariants}>
                <PrimaryButton onClick={() => navigate('/login')} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Users size={18} /> Join Default Team
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate('/signup')} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <UserPlus size={18} /> Create Workspace
                </SecondaryButton>
              </ButtonGroup>
            </HeroText>
            <HeroImageContainer variants={itemVariants}>
              <motion.img 
                src={homeImage} 
                alt="Team Collaboration" 
                className="hero-img"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
            </HeroImageContainer>
          </HeroGrid>
        </HeroSection>

        {/* FEATURES SECTION */}
        <Section 
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <SectionHeader>
            <SectionBadge variants={itemVariants}>Features</SectionBadge>
            <SectionTitle variants={itemVariants}>Everything you need to move faster.</SectionTitle>
            <SectionSubtitle variants={itemVariants}>
              Forget switching between tools. We provide a complete suite of professional utilities designed to help your team execute flawlessly.
            </SectionSubtitle>
          </SectionHeader>

          <FeaturesGrid>
            {[
              { icon: CheckSquare, title: "Task Tracking", desc: "Easily create, assign, and track tasks with intuitive drag-and-drop tools.", color: "#4F46E5", bg: "#EEF2FF" },
              { icon: MessageSquare, title: "Team Chat", desc: "Work together in real-time with integrated chat and seamless file dropping.", color: "#8B5CF6", bg: "#F5F3FF" },
              { icon: Presentation, title: "Virtual Whiteboard", desc: "Collaborate visually with an interactive infinite whiteboard for brainstorming.", color: "#E11D48", bg: "#FFF1F2" },
              { icon: FileText, title: "Document Vault", desc: "Manage version-controlled files effortlessly securely across your team.", color: "#059669", bg: "#ECFDF5" }
            ].map((feat, idx) => (
              <FeatureCard key={idx} variants={itemVariants} whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
                <IconWrapper style={{ color: feat.color, backgroundColor: feat.bg }}>
                  <feat.icon size={24} strokeWidth={2.5} />
                </IconWrapper>
                <FeatureTitle>{feat.title}</FeatureTitle>
                <FeatureText>{feat.desc}</FeatureText>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Section>

        {/* TESTIMONIALS SECTION */}
        <Section
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <SectionHeader>
            <SectionBadge variants={itemVariants}>Testimonials</SectionBadge>
            <SectionTitle variants={itemVariants}>Trusted by professionals.</SectionTitle>
          </SectionHeader>

          <TestimonialsGrid>
            {[
              { author: "Priy Mavani", role: "Team Lead", text: "Task Bridge completely transformed our workflow. Our cross-functional teams now communicate effortlessly." },
              { author: "Krish Shyara", role: "Project Manager", text: "The UI is clean and fast. We abandoned three massive enterprise tools just to consolidate onto this platform." }
            ].map((test, idx) => (
              <TestimonialCard key={idx} variants={itemVariants} whileHover={{ y: -5 }}>
                <Quote size={60} color="#F1F5F9" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <StarsRow>
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="#FACC15" color="#FACC15" />)}
                  </StarsRow>
                  <TestimonialText>"{test.text}"</TestimonialText>
                  <TestimonialAuthor>{test.author}</TestimonialAuthor>
                  <TestimonialRole>{test.role}</TestimonialRole>
                </div>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
        </Section>

        {/* CTA SECTION */}
        <CtaSection
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <CtaBox variants={itemVariants}>
            <CtaTitle>Start building your team today.</CtaTitle>
            <CtaText>Join thousands of users organizing their work with Task Bridge.</CtaText>
            <ButtonGroup style={{ justifyContent: 'center' }}>
              <PrimaryCtaButton onClick={() => navigate('/login')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Get Started <ArrowRight size={16} strokeWidth={2.5} style={{ marginLeft: '6px' }} />
              </PrimaryCtaButton>
            </ButtonGroup>
          </CtaBox>
        </CtaSection>

      </HomeContent>
    </HomeContainer>
  );
};

// -----------------------------------------------------
// STYLED COMPONENTS (PREMIUM LIGHT THEME)
// -----------------------------------------------------

const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: #3498db;
  color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const BackgroundGrid = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200vh;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 0;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
`;

const HomeContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1150px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Section = styled.section`
  padding: 7rem 0;
  min-height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroSection = styled(Section)`
  padding-top: 10rem;
  padding-bottom: 5rem;
  min-height: 90vh;
`;

// HERO
const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 4rem;
  }
`;

const HeroText = styled(motion.div)`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 968px) {
    align-items: center;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
  letter-spacing: -0.04em;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 95%;
  font-weight: 400;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const BaseButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px; 
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(BaseButton)`
  background: #0F172A;
  color: #FFFFFF;
  box-shadow: 0 4px 14px 0 rgba(15, 23, 42, 0.25);

  &:hover {
    background: #1E293B;
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.23);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: #FFFFFF;
  color: #334155;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:hover {
    background: #F8FAFC;
    color: #0F172A;
    border-color: #CBD5E1;
  }
`;

const HeroImageContainer = styled(motion.div)`
  .hero-img {
    width: 100%;
    max-width: 600px;
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.08));
  }
  
  @media (max-width: 968px) {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
`;

// SECTION TITLES
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionBadge = styled(motion.div)`
  display: inline-block;
  padding: 0.35rem 1rem;
  background: #EEF2FF;
  border: 1px solid #E0E7FF;
  color: #4F46E5;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
  letter-spacing: -0.03em;
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

// FEATURES
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  border: 1px solid #F1F5F9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.3s ease;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
`;

const FeatureText = styled.p`
  color: #64748B;
  line-height: 1.6;
  font-size: 0.95rem;
`;

// TESTIMONIALS
const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled(motion.div)`
  background: #FFFFFF;
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
`;

const StarsRow = styled.div`
  display: flex;
  gap: 0.2rem;
  margin-bottom: 1.25rem;
`;

const TestimonialText = styled.p`
  font-size: 1.05rem;
  color: #334155;
  line-height: 1.7;
  margin-bottom: 2rem;
  font-weight: 400;
`;

const TestimonialAuthor = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #0F172A;
`;

const TestimonialRole = styled.p`
  font-size: 0.85rem;
  color: #64748B;
  margin-top: 0.2rem;
`;

// CTA
const CtaSection = styled.section`
  padding: 2rem 0 6rem 0;
`;

const CtaBox = styled(motion.div)`
  background: #0F172A;
  border-radius: 24px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.2);
  position: relative;
  overflow: hidden;

  /* Subtle inner pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.5;
  }
`;

const CtaTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #FFFFFF;
  letter-spacing: -0.03em;
  position: relative;
  z-index: 2;
`;

const CtaText = styled.p`
  font-size: 1.125rem;
  color: #94A3B8;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 2;
`;

const PrimaryCtaButton = styled(BaseButton)`
  background: #FFFFFF;
  color: #0F172A;
  box-shadow: 0 4px 14px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;

  &:hover {
    background: #F8FAFC;
    transform: translateY(-2px);
  }
`;

export default Home;
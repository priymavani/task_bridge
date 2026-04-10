import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Users, UserPlus, Presentation,
  CheckSquare, MessageSquare, FileText,
  Star, Quote, ArrowRight, Play
} from 'lucide-react';

import homeImage from '../assets/home_i.png';
import logo from '../assets/Logo.png';

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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
      {/* Decorative Background Elements */}
      <TopGradientBlob />
      <BottomGradientBlob style={{ y: yPos }} />
      <BackgroundGrid />

      <HomeContent>
        {/* HERO SECTION */}
        <HeroSection as={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
          <HeroGrid>
            <HeroText variants={containerVariants}>
              <Badge variants={itemVariants}>
                <span className="dot" />
                Task Bridge 2.0 is now live
              </Badge>

              <Title variants={itemVariants}>
                Unify your workflow.<br />
                <GradientText>Unleash your team.</GradientText>
              </Title>

              <Subtitle variants={itemVariants}>
                The all-in-one workspace that brings your project management, real-time collaboration, and documents into one beautifully seamless experience.
              </Subtitle>

              <ButtonGroup variants={itemVariants}>
                <PrimaryButton onClick={() => navigate('/login')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                  Join Team <ArrowRight size={18} strokeWidth={2.5} style={{ marginLeft: '6px' }} />
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate('/signup')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Play size={18} fill="#334155" /> Create Team
                </SecondaryButton>
              </ButtonGroup>

              <HeroFooter variants={itemVariants}>
                <div className="users-avatars">
                  {/* Decorative avatars container */}
                  <div className="avatar a1"></div>
                  <div className="avatar a2"></div>
                  <div className="avatar a3"></div>
                </div>
                <div className="users-text">
                  <strong>Join 10,000+ teams</strong> <br />
                  transforming how they work
                </div>
              </HeroFooter>
            </HeroText>

            <HeroImageWrapper variants={itemVariants}>
              <HeroImageRing />
              <motion.div
                className="image-container"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <img src={homeImage} alt="Team Collaboration" className="main-img" />
              </motion.div>
            </HeroImageWrapper>
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
            <SectionTitle variants={itemVariants}>The ultimate productivity suite.</SectionTitle>
            <SectionSubtitle variants={itemVariants}>
              Say goodbye to juggling ten different apps. We provide a complete arsenal of professional utilities designed perfectly for modern teams.
            </SectionSubtitle>
          </SectionHeader>

          <FeaturesGrid>
            {[
              { icon: CheckSquare, title: "Task Tracking", desc: "Create, assign, and track tasks with robust agile boards.", color: "#3498db", bg: "rgba(52, 152, 219, 0.1)" },
              { icon: MessageSquare, title: "Team Chat", desc: "Work together in real-time with integrated chat channels.", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" },
              { icon: Presentation, title: "Virtual Whiteboard", desc: "Collaborate visually with an interactive infinite whiteboard.", color: "#E11D48", bg: "rgba(225, 29, 72, 0.1)" },
              { icon: FileText, title: "Document Vault", desc: "Manage version-controlled files securely across your team.", color: "#059669", bg: "rgba(5, 150, 105, 0.1)" }
            ].map((feat, idx) => (
              <FeatureCard key={idx} variants={itemVariants} whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.06)' }}>
                <IconWrapper style={{ color: feat.color, backgroundColor: feat.bg }}>
                  <feat.icon size={26} strokeWidth={2} />
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
            <SectionTitle variants={itemVariants}>Loved by industry leaders.</SectionTitle>
          </SectionHeader>

          <TestimonialsGrid>
            {[
              { author: "Priy Mavani", role: "Team Lead", text: "Task Bridge completely transformed our workflow. Our cross-functional teams now communicate effortlessly." },
              { author: "Krish Shyara", role: "Project Manager", text: "The UI is incredibly clean and fast. We abandoned massive enterprise tools just to consolidate onto this platform." }
            ].map((test, idx) => (
              <TestimonialCard key={idx} variants={itemVariants} whileHover={{ y: -5 }}>
                <Quote size={80} color="#F1F5F9" style={{ position: 'absolute', top: '-10px', right: '-10px', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <StarsRow>
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="#FACC15" color="#FACC15" />)}
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
            <CtaText>Join thousands of high-performing teams organizing their work with Task Bridge.</CtaText>
            <ButtonGroup style={{ justifyContent: 'center' }}>
              <PrimaryCtaButton onClick={() => navigate('/login')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Get Started for Free
              </PrimaryCtaButton>
            </ButtonGroup>
          </CtaBox>
        </CtaSection>

      </HomeContent>
    </HomeContainer>
  );
};

// -----------------------------------------------------
// STYLED COMPONENTS (ULTRA-PREMIUM LIGHT THEME)
// -----------------------------------------------------

const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: #FFFFFF;
  color: #0F172A;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

// Soft ambient glowing background blobs using the requested #3498db blue
const TopGradientBlob = styled.div`
  position: absolute;
  top: -15%;
  left: 5%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(52,152,219,0.08) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
`;

const BottomGradientBlob = styled(motion.div)`
  position: absolute;
  top: 60%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
`;

const BackgroundGrid = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%);
  z-index: 0;
  pointer-events: none;
`;

const HomeContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Section = styled.section`
  padding: 8rem 0;
  min-height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroSection = styled(Section)`
  padding-top: 10rem;
  padding-bottom: 6rem;
  min-height: 95vh;
`;

// HERO
const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 2rem;
  }
`;

const HeroText = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  @media (max-width: 968px) {
    align-items: center;
  }
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);

  .dot {
    width: 8px; height: 8px;
    background-color: #3498db;
    border-radius: 50%;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(3.5rem, 5.5vw, 4.5rem);
  font-weight: 800;
  line-height: 1.05;
  color: #0F172A;
  margin-bottom: 1.5rem;
  letter-spacing: -0.04em;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #3498db 0%, #6366F1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #475569;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 90%;
  font-weight: 400;

  @media (max-width: 968px) {
    max-width: 100%;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const BaseButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 9999px; 
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(BaseButton)`
  background: #3498db;
  color: #FFFFFF;
  box-shadow: 0 10px 25px -5px rgba(52, 152, 219, 0.4);

  &:hover {
    background: #2980b9;
    box-shadow: 0 15px 30px -5px rgba(52, 152, 219, 0.5);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: #FFFFFF;
  color: #334155;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #F8FAFC;
    color: #0F172A;
    border-color: #CBD5E1;
  }
`;

const HeroFooter = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;

  .users-avatars {
    display: flex;
    .avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: 3px solid white;
      margin-left: -15px;
      &:first-child { margin-left: 0; }
    }
    .a1 { background: #3498db; }
    .a2 { background: #8B5CF6; }
    .a3 { background: #FCD34D; }
  }

  .users-text {
    font-size: 0.9rem;
    color: #64748B;
    line-height: 1.4;
    strong { color: #0F172A; }
  }
`;

const HeroImageWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .image-container {
    position: relative;
    z-index: 2;
    padding: 2rem;
    background: white;
    border-radius: 32px;
    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.1);
    border: 1px solid rgba(226, 232, 240, 0.8);
    
    .main-img {
      width: 100%;
      max-width: 500px;
      border-radius: 16px;
    }
  }
`;

const HeroImageRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0%, rgba(52,152,219,0.1) 40%, rgba(139,92,246,0.1) 60%, transparent 100%);
  animation: spin 15s linear infinite;
  z-index: 1;

  @keyframes spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

// SECTION TITLES
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 4vw, 3rem);
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #64748B;
  line-height: 1.6;
`;

// FEATURES
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: #FFFFFF;
  border-radius: 24px;
  padding: 3rem 2rem;
  border: 1px solid #F1F5F9;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.3s ease;
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const FeatureText = styled.p`
  color: #64748B;
  line-height: 1.7;
  font-size: 1rem;
`;

// TESTIMONIALS
const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
`;

const TestimonialCard = styled(motion.div)`
  background: #FFFFFF;
  padding: 3rem;
  border-radius: 24px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
`;

const StarsRow = styled.div`
  display: flex;
  gap: 0.2rem;
  margin-bottom: 1.5rem;
`;

const TestimonialText = styled.p`
  font-size: 1.125rem;
  color: #334155;
  line-height: 1.8;
  margin-bottom: 2.5rem;
`;

const TestimonialAuthor = styled.h4`
  font-size: 1.05rem;
  font-weight: 800;
  color: #0F172A;
`;

const TestimonialRole = styled.p`
  font-size: 0.9rem;
  color: #64748B;
  margin-top: 0.25rem;
`;

// CTA
const CtaSection = styled.section`
  padding: 4rem 0 8rem 0;
`;

const CtaBox = styled(motion.div)`
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border-radius: 32px;
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.3);

  /* Inner glow from the brand blue */
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 100%;
    background: radial-gradient(circle, rgba(52,152,219,0.3) 0%, transparent 70%);
    z-index: 1;
    pointer-events: none;
  }
`;

const CtaTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #FFFFFF;
  letter-spacing: -0.03em;
  position: relative;
  z-index: 2;
`;

const CtaText = styled.p`
  font-size: 1.25rem;
  color: #94A3B8;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 2;
`;

const PrimaryCtaButton = styled(BaseButton)`
  background: #3498db;
  color: #FFFFFF;
  box-shadow: 0 10px 25px -5px rgba(52, 152, 219, 0.4);
  position: relative;
  z-index: 2;

  &:hover {
    background: #2980b9;
    box-shadow: 0 15px 30px -5px rgba(52, 152, 219, 0.5);
    transform: translateY(-2px);
  }
`;

export default Home;
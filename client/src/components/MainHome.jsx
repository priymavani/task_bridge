import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Video, FileText, Presentation, 
  MessageSquare, Calendar, HelpCircle, Users, 
  Settings, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import Pattern from '../Ui/Pattern'; 
import logo from '../assets/Logo.png';
import profile from '../assets/home_/profile_i.png';

const MainHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const name = sessionStorage.getItem("full_name") || "Team Member";

  const menuItems = [
    {
      id: 1,
      title: "Task Management",
      desc: "Assign and track team tasks",
      icon: <LayoutDashboard size={24} />,
      path: "/task",
      color: "#6583FC",
      bg: "#EEF2FF"
    },
    {
      id: 2,
      title: "Video Conference",
      desc: "Start a real-time meeting",
      icon: <Video size={24} />,
      path: "/meeting",
      color: "#F59E0B",
      bg: "#FEF3C7"
    },
    {
      id: 3,
      title: "Document Hub",
      desc: "Share & manage files securely",
      icon: <FileText size={24} />,
      path: "/documents",
      color: "#10B981",
      bg: "#D1FAE5"
    },
    {
      id: 4,
      title: "Virtual Whiteboard",
      desc: "Collaborate on a blank canvas",
      icon: <Presentation size={24} />,
      path: "/whiteboard",
      color: "#3B82F6",
      bg: "#DBEAFE"
    },
    {
      id: 5,
      title: "Team Chat",
      desc: "Instant messaging channel",
      icon: <MessageSquare size={24} />,
      path: "/chat",
      color: "#8B5CF6",
      bg: "#EDE9FE"
    },
    {
      id: 6,
      title: "Calendar Schedule",
      desc: "Upcoming events & deadlines",
      icon: <Calendar size={24} />,
      path: "/calendar",
      color: "#EC4899",
      bg: "#FCE7F3"
    }
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <DashboardLayout>
      <Pattern />
      
      {/* SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <LogoWrapper>
            <img src={logo} alt="Task Bridge" />
            {isSidebarOpen && <BrandName>Task Bridge</BrandName>}
          </LogoWrapper>
          <ToggleBtn onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </ToggleBtn>
        </SidebarHeader>

        <NavList>
          <NavItem to="/home" className="active">
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </NavItem>
          <NavItem to="/team">
            <Users size={20} />
            {isSidebarOpen && <span>My Team</span>}
          </NavItem>
          <NavItem to="/faq">
            <HelpCircle size={20} />
            {isSidebarOpen && <span>Help & FAQ</span>}
          </NavItem>
          <NavItem to="/profile">
            <Settings size={20} />
            {isSidebarOpen && <span>Settings</span>}
          </NavItem>
        </NavList>

        <SidebarFooter>
          <UserProfile to="/profile">
            <img src={profile} alt="Profile" />
            {isSidebarOpen && (
              <UserInfo>
                <h4>{name}</h4>
                <p>Welcome back</p>
              </UserInfo>
            )}
          </UserProfile>
          {isSidebarOpen && (
            <LogoutButton onClick={handleLogout} title="Log out">
              <LogOut size={18} />
            </LogoutButton>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* MAIN CONTENT AREA */}
      <MainArea isOpen={isSidebarOpen}>
        <TopBar>
          <WelcomeText>
            <h1>Welcome to your Dashboard</h1>
            <p>Here's what's happening with your team today.</p>
          </WelcomeText>
          <TopActions>
            <QuickActionBtn onClick={() => navigate('/task')}>
              + New Task
            </QuickActionBtn>
          </TopActions>
        </TopBar>

        <ModuleGrid>
          {menuItems.map((item, idx) => (
            <ModuleCard 
              key={item.id}
              to={item.path}
              as={motion(Link)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardIcon bg={item.bg} color={item.color}>
                {item.icon}
              </CardIcon>
              <CardContent>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </CardContent>
              <CardArrow className="arrow">
                <ChevronRight size={20} color="#9CA3AF" />
              </CardArrow>
            </ModuleCard>
          ))}
        </ModuleGrid>
      </MainArea>
    </DashboardLayout>
  );
};

// -----------------------------------------------------
// STYLED COMPONENTS
// -----------------------------------------------------

const DashboardLayout = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #F8FAFC;
  position: relative;
`;

const Sidebar = styled.div`
  width: ${props => props.isOpen ? '260px' : '80px'};
  height: 100vh;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.02);
`;

const SidebarHeader = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(101,131,252,0.2));
  }
`;

const BrandName = styled.span`
  font-weight: 700;
  font-size: 1.125rem;
  white-space: nowrap;
  color: #1E293B;
  background: linear-gradient(135deg, #6583FC 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: #64748B;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 6px;

  &:hover {
    background: #F1F5F9;
    color: #0F172A;
  }
`;

const NavList = styled.nav`
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem;
  border-radius: 12px;
  color: #64748B;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover, &.active {
    background: #EEF2FF;
    color: #6583FC;
  }

  &.active {
    font-weight: 600;
  }
`;

const SidebarFooter = styled.div`
  padding: 1.25rem 1rem;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserProfile = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  overflow: hidden;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #E2E8F0;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  white-space: nowrap;

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1E293B;
  }

  p {
    font-size: 0.75rem;
    color: #64748B;
    margin-top: 0.1rem;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #FEE2E2;
    color: #EF4444;
  }
`;

// MAIN AREA
const MainArea = styled.main`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem 3rem;
  position: relative;
  z-index: 5;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.4);
`;

const WelcomeText = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #64748B;
  }
`;

const TopActions = styled.div``;

const QuickActionBtn = styled.button`
  background: linear-gradient(135deg, #6583FC 0%, #4f6cf5 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(101, 131, 252, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(101, 131, 252, 0.4);
  }
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const ModuleCard = styled(Link)`
  text-decoration: none;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  overflow: hidden;

  &:hover {
    .arrow {
      transform: translateX(5px);
      color: #6583FC !important;
    }
  }
`;

const CardIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg};
  color: ${props => props.color};
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1E293B;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: #64748B;
    line-height: 1.4;
  }
`;

const CardArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

export default MainHome;

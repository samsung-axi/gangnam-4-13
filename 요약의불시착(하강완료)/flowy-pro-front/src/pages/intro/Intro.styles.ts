import styled, { keyframes } from 'styled-components';

// 애니메이션 정의
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

export const IntroContainer = styled.div`
  cursor: default;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f5ff 0%, #e3cfee 100%);
`;

export const HeroSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
  color: white;
  overflow: hidden;
`;

export const DecorativeElement = styled.div`
  position: absolute;
  top: 10%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
    border-radius: 50%;
    animation: ${float} 4s ease-in-out infinite reverse;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  font-family: 'Rethink Sans', sans-serif;
  margin-bottom: 1rem;
  line-height: 1.2;
  animation: ${fadeInUp} 1s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  color: #a480b8;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const HeroDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  animation: ${fadeInUp} 1s ease-out 0.4s both;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const FeatureSection = styled.section`
  padding: 5rem 2rem;
  background: white;
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #351745;
  font-family: 'Rethink Sans', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(53, 23, 69, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(53, 23, 69, 0.15);
    border-color: #a480b8;
  }
`;

export const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${pulse} 2s ease-in-out infinite;
  color: #480b6a;
  display: flex;
  justify-content: center;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #351745;
`;

export const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  white-space: pre-line;
`;

export const ProcessSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f8f5ff 0%, #e3cfee 100%);
`;

export const ProcessStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 250px;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 2rem;
  }
`;

export const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #480b6a 0%, #351745 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(72, 11, 106, 0.3);
`;

export const StepTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #351745;
`;

export const StepDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #666;
  white-space: pre-line;
`;

export const CTASection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #351745 0%, #480b6a 100%);
  color: white;
  text-align: center;
`;

export const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Rethink Sans', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const CTADescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const CTAButton = styled.button`
  background: white;
  color: #351745;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 1s ease-out 0.6s both;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    background: #f8f5ff;
  }
  
  &:active {
    transform: translateY(0);
  }
`; 
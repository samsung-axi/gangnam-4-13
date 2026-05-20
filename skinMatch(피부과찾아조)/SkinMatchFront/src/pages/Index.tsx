import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Container, Section } from '@/components/ui/theme-container';

const Index = () => {

  // Simple implementation of useInView hook functionality
  const useInView = <T extends HTMLElement,>() => {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
      }, {
        threshold: 0.3
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return {
      ref,
      inView
    };
  };

  const hero = useInView<HTMLDivElement>();
  const secondSection = useInView<HTMLDivElement>();
  const thirdSection = useInView<HTMLDivElement>();
  return <div className="theme-home-bright min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Fixed Background */}
      {/* Hero Section */}
<Section 
  spacing="hero" 
  className="relative min-h-screen bg-fixed bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/lovable-uploads/KakaoTalk_20250825_160859955.jpg)'
  }}
>
  <Container size="xl">
    <div className="relative z-10 flex items-center justify-center py-20 min-h-screen">
      <div 
        ref={hero.ref} 
        className={`flex flex-col items-center justify-center text-center space-y-8 transition-all duration-1000 ease-out ${
          hero.inView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="text-4xl md:text-6xl text-white font-sans font-bold">
        Scan. Detect. Connect.
        </h1>
        <h2 className="text-xl md:text-2xl text-white/90 font-sans">
        AI 피부 분석으로 질환을 빠르게 확인하세요
        </h2>
      </div>
    </div>
  </Container>
</Section>



      {/* AI 진단 홍보 Section */}
<Section 
  spacing="hero" 
  className="relative min-h-screen bg-fixed bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/lovable-uploads/cloudd.jpg)'
  }}
>
  {/* 어두운 오버레이 - 배경만 어둡게 */}
  <div className="absolute inset-0 bg-black/30"></div>
  <Container size="xl">
    <div 
      ref={secondSection.ref}
      className={`flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
        secondSection.inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-white">
          AI 기반 피부 종양 분석과 맞춤 병원 추천
        </h2>
      <Link to="/camera">
        <Button 
          size="lg" 
          className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
        >
          AI 종양 분석하기
        </Button>
      </Link>
    </div>
  </Container>
</Section>

{/* AI 안면 분석 Section */}
<Section 
  spacing="hero" 
  className="relative min-h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/lovable-uploads/KakaoTalk_20250825_153335151.png)'
  }}
>
  {/* 어두운 오버레이 - 배경만 어둡게 */}
  <div className="absolute inset-0 bg-black/30"></div>
  <Container size="xl">
    <div 
      ref={thirdSection.ref}
      className={`flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
        thirdSection.inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-sans font-bold text-white">
      AI 기반 안면부 피부질환 분석과 맞춤 병원 추천
      </h2>
      <Link to="/camera">
        <Button 
          size="lg" 
          className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
        >
          AI 안면부 분석하기
        </Button>
      </Link>
    </div>
  </Container>
</Section>
    </div>;
};
export default Index;
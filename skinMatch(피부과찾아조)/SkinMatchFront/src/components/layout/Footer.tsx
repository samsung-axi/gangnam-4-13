import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Analysis', path: '/camera' },
    { label: 'My Page', path: '/profile' },
    { label: 'Login', path: '/login' },
  ];

  const teamMembers = [
    { name: '고경복', email: 'gbk08@naver.com' },
    { name: '김민경', email: 'dorian.kim.dev@gmail.com' },
    { name: '손석우', email: 'son90234@gmail.com' },
    { name: '이민지', email: 'lminjiiiii@gmail.com' },
    { name: '조성민', email: 'tjdals7071@gmail.com' },
  ];

  return (
    <footer className="bg-white text-black py-20 mt-auto border-t border-gray-300">
      <div className="container mx-auto px-6">
        {/* 반응형 레이아웃: 모바일=세로, md 이상=4단 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
  {/* 위에 이미지 */}
  <div
    className="mb-4 h-48 w-96 bg-no-repeat bg-contain bg-left"
    style={{
      backgroundImage: "url(/lovable-uploads/footer.jpg)",
      backgroundPositionX: "8px", // ← 여기서 직접 왼쪽 여백 조절
    }}
  ></div>

  {/* 로고 */}
  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
    SkinMatch
  </h1>
</div>

          {/* Navigation - 오른쪽으로 이동 */}
          <div className="flex md:block justify-center md:justify-start md:ml-24">
            <div>
              <h3 className="text-sm font-bold mb-4">(NAVIGATION)</h3>
              <ul className="space-y-3 text-center md:text-left">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-2xl font-bold hover:opacity-70 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* About - 조금 오른쪽으로 이동 */}
<div className="text-center md:text-left md:ml-12">
  <h3 className="text-sm font-bold mb-4">(ABOUT)</h3>
  <p className="text-sm leading-relaxed whitespace-pre-line">
    <span 
      className="font-extrabold inline-block text-[#222]"
    >
      SkinMatch
    </span>{" "}
    uses artificial intelligence-based skin analysis,
    I understand your skin condition and suggest the appropriate hospital and medical services.
    Beyond just diagnosis, for better skin health
    We will be your partner for the first step.
  </p>
</div>


         {/* Info - 이름만 보이고, 호버 시 이메일 나타나게 */}
<div className="text-left md:ml-36">
  <h3 className="text-sm font-bold mb-4">(INFO)</h3>
  <div className="space-y-3"> {/* 기본 간격은 살짝만 */}
    {teamMembers.map((member, index) => (
      <div
        key={index}
        className="text-sm group transition-all duration-300"
      >
        <p className="font-medium cursor-pointer">{member.name}</p>
        <a
          href={`mailto:${member.email}`}
          className="text-gray-600 hover:underline text-sm 
                     opacity-0 group-hover:opacity-100 
                     max-h-0 group-hover:max-h-10 
                     overflow-hidden block transition-all duration-300"
        >
          {member.email}
        </a>
      </div>
    ))}
  </div>
</div>

        </div>

        {/* 하단 카피라이트 */}
<div className="border-t border-gray-300 mt-20 pt-6">
  <p className="text-center text-gray-500 text-sm">
    © 2025 SkinMatch. All rights reserved.
  </p>
</div>

      </div>
    </footer>
  );
};

export default Footer;

import styled from "styled-components";

export const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white;
  font-family: 'Rethink Sans', sans-serif;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Menu = styled.ul`
  list-style: none;
  display: flex;
  gap: 30px;
`;

export const MenuItem = styled.li`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  /* 선택된 상태 */
  &.selected {
    background-color: #e5e0ee;
    border-left: 3px solid #4b2067;
  }

  &.selected:hover {
    background-color: #d4c7e8;
  }
`;



export const TextButton = styled.button`
  background: none;
  color: #351745;
  border: none;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FilledButton = styled.button`
  background: #480b6a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #351745;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(72, 11, 106, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LogoImg = styled.img`
  width: 93.273px;
  height: 44.591px;
  margin-right: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(1.02);
  }
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ProfileIconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;

  ${ProfileSection}:hover & {
    background-color: #e5e0ee;
    transform: scale(1.1);
  }
`;

export const ProfileIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: #351745;
  transition: all 0.2s ease;

  ${ProfileSection}:hover & {
    fill: #4b2067;
  }
`;

export const LogoutText = styled.span`
  color: #351745;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  transition: all 0.2s ease;

  ${ProfileSection}:hover & {
    color: #4b2067;
    font-weight: 600;
  }
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  min-width: 150px;
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
`;

export const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  color: #351745;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f5ff;
    color: #4b2067;
    transform: translateX(4px);
    font-weight: 600;
  }

  &:active {
    background-color: #e5e0ee;
  }
`;

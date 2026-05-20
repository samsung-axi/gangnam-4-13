import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 30%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CloseButton = styled.button`
  font-size: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const ModalBody = styled.div`
  margin: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-weight: bold;
    margin-top: 10px;
  }
`;

export const ModalFooter = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
`;

export const ModalButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  border: 1px solid #f29f05;
  background-color: white;
  color: orange;
  border-radius: 4px;
  cursor: pointer;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  label {
    width: 120px; /* 원하는 너비 */
    font-weight: bold;
    margin-right: 10px;
  }

  input {
    flex: 1;
  }
`;

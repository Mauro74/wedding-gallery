import React, { useState } from 'react';
import styled from 'styled-components';

interface PasswordProtectionProps {
  onPasswordCorrect: () => void;
}

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0e2017;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-family: 'Luxurious Script', cursive;
  font-size: 3.5rem;
  color: #d4d4c8;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Subtitle = styled.p`
  color: #d4d4c8;
  opacity: 0.8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  font-style: italic;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PasswordInput = styled.input`
  padding: 1rem;
  border: 2px solid rgba(212, 212, 200, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #d4d4c8;
  font-size: 1.1rem;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(212, 212, 200, 0.5);
  }

  &:focus {
    border-color: #d4d4c8;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 20px rgba(212, 212, 200, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #d4d4c8, #b8b8a8);
  color: #0e2017;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(212, 212, 200, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.9;
`;

const HeartIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onPasswordCorrect }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password is now stored in environment variable for security
  const CORRECT_PASSWORD = import.meta.env.VITE_GALLERY_PASSWORD || 'defaultpassword';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        onPasswordCorrect();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <HeartIcon>💕</HeartIcon>
        <Title>Karen & Maurizio</Title>
        <Subtitle>Wedding Gallery</Subtitle>

        <Form onSubmit={handleSubmit}>
          <PasswordInput
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoFocus
          />

          <SubmitButton type="submit" disabled={isLoading || !password}>
            {isLoading ? 'Checking...' : 'Enter Gallery'}
          </SubmitButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default PasswordProtection;

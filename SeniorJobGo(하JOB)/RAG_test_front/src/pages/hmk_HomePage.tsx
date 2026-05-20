import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import HmkChatBot from '../components/hmk_ChatBot';

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}));

const HmkHomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <WorkIcon fontSize="large" />,
      title: '맞춤 직종 추천',
      description: '나에게 딱 맞는 직종을 AI가 추천해드립니다.',
      action: () => navigate('/job-recommendation'),
    },
    {
      icon: <DescriptionIcon fontSize="large" />,
      title: '이력서 작성',
      description: 'AI의 도움을 받아 전문적인 이력서를 작성해보세요.',
      action: () => navigate('/resume'),
    },
    {
      icon: <SearchIcon fontSize="large" />,
      title: '일자리 찾기',
      description: '추천받은 직종의 채용 정보를 확인하고 지원하세요.',
      action: () => navigate('/jobs'),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          시니어 잡 플랫폼에 오신 것을 환영합니다
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          AI 상담사와 대화하면서 나에게 맞는 일자리를 찾아보세요
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard elevation={2} onClick={feature.action}>
              <IconWrapper>
                {feature.icon}
              </IconWrapper>
              <Typography variant="h5" component="h2" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          AI 상담사와 대화하기
        </Typography>
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          취업 상담부터 이력서 작성까지, AI 상담사가 도와드립니다.
        </Typography>
      </Box>

      <HmkChatBot />
    </Box>
  );
};

export default HmkHomePage; 
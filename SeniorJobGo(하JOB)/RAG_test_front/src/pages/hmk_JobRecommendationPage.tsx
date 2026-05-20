import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const steps = ['기본 정보', '경력 사항', '선호도 조사', '추천 결과'];

interface BasicInfo {
  age: string;
  gender: string;
  location: string;
  education: string;
  healthStatus: string;
}

interface CareerInfo {
  recentJob: string;
  totalExperience: string;
  skills: string[];
  preferredIndustry: string;
}

interface Preferences {
  workingHours: number;
  physicalWork: number;
  teamwork: number;
  salary: string;
  workEnvironment: string;
}

interface FormErrors {
  basicInfo: {
    age?: string;
    gender?: string;
    location?: string;
    education?: string;
    healthStatus?: string;
  };
  careerInfo: {
    recentJob?: string;
    totalExperience?: string;
    skills?: string;
    preferredIndustry?: string;
  };
  preferences: {
    salary?: string;
    workEnvironment?: string;
  };
}

const HmkJobRecommendationPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({
    basicInfo: {},
    careerInfo: {},
    preferences: {},
  });
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    age: '',
    gender: '',
    location: '',
    education: '',
    healthStatus: '',
  });
  const [careerInfo, setCareerInfo] = useState<CareerInfo>({
    recentJob: '',
    totalExperience: '',
    skills: [],
    preferredIndustry: '',
  });
  const [preferences, setPreferences] = useState<Preferences>({
    workingHours: 8,
    physicalWork: 5,
    teamwork: 5,
    salary: '',
    workEnvironment: '',
  });

  const handleNext = () => {
    let isValid = false;
    
    switch (activeStep) {
      case 0:
        isValid = validateBasicInfo();
        break;
      case 1:
        isValid = validateCareerInfo();
        break;
      case 2:
        isValid = validatePreferences();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBasicInfoChange = (field: keyof BasicInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBasicInfo({ ...basicInfo, [field]: event.target.value });
  };

  const handleCareerInfoChange = (field: keyof CareerInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCareerInfo({ ...careerInfo, [field]: event.target.value });
  };

  const handlePreferencesChange = (field: keyof Preferences) => (
    event: React.ChangeEvent<HTMLInputElement> | Event,
    value: number | number[]
  ) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const validateBasicInfo = (): boolean => {
    const newErrors = {
      age: !basicInfo.age ? '나이를 입력해주세요' : 
           parseInt(basicInfo.age) < 50 ? '50세 이상만 이용 가능합니다' : undefined,
      gender: !basicInfo.gender ? '성별을 선택해주세요' : undefined,
      location: !basicInfo.location ? '거주지역을 입력해주세요' : undefined,
      education: !basicInfo.education ? '최종학력을 입력해주세요' : undefined,
      healthStatus: !basicInfo.healthStatus ? '건강상태를 선택해주세요' : undefined,
    };

    setErrors(prev => ({ ...prev, basicInfo: newErrors }));
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const validateCareerInfo = (): boolean => {
    const newErrors = {
      recentJob: !careerInfo.recentJob ? '최근 직종을 입력해주세요' : undefined,
      totalExperience: !careerInfo.totalExperience ? '총 경력 기간을 입력해주세요' : undefined,
      skills: careerInfo.skills.length === 0 ? '하나 이상의 기술이나 자격증을 입력해주세요' : undefined,
      preferredIndustry: !careerInfo.preferredIndustry ? '선호하는 업종을 입력해주세요' : undefined,
    };

    setErrors(prev => ({ ...prev, careerInfo: newErrors }));
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const validatePreferences = (): boolean => {
    const newErrors = {
      salary: !preferences.salary ? '희망 급여를 입력해주세요' : undefined,
      workEnvironment: !preferences.workEnvironment ? '선호하는 근무 환경을 선택해주세요' : undefined,
    };

    setErrors(prev => ({ ...prev, preferences: newErrors }));
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const renderError = (error?: string) => {
    if (!error) return null;
    return (
      <Typography color="error" variant="caption" sx={{ mt: 1 }}>
        {error}
      </Typography>
    );
  };

  const renderBasicInfoForm = () => (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        기본 정보를 입력해주세요
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="나이"
            value={basicInfo.age}
            onChange={handleBasicInfoChange('age')}
            type="number"
            error={!!errors.basicInfo.age}
            helperText={errors.basicInfo.age}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset" error={!!errors.basicInfo.gender}>
            <FormLabel>성별</FormLabel>
            <RadioGroup
              row
              value={basicInfo.gender}
              onChange={handleBasicInfoChange('gender')}
            >
              <FormControlLabel value="male" control={<Radio />} label="남성" />
              <FormControlLabel value="female" control={<Radio />} label="여성" />
            </RadioGroup>
            {renderError(errors.basicInfo.gender)}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="거주지역"
            value={basicInfo.location}
            onChange={handleBasicInfoChange('location')}
            error={!!errors.basicInfo.location}
            helperText={errors.basicInfo.location}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="최종학력"
            value={basicInfo.education}
            onChange={handleBasicInfoChange('education')}
            error={!!errors.basicInfo.education}
            helperText={errors.basicInfo.education}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" error={!!errors.basicInfo.healthStatus}>
            <FormLabel>건강상태</FormLabel>
            <RadioGroup
              value={basicInfo.healthStatus}
              onChange={handleBasicInfoChange('healthStatus')}
            >
              <FormControlLabel
                value="excellent"
                control={<Radio />}
                label="매우 좋음"
              />
              <FormControlLabel value="good" control={<Radio />} label="좋음" />
              <FormControlLabel
                value="fair"
                control={<Radio />}
                label="보통"
              />
              <FormControlLabel
                value="poor"
                control={<Radio />}
                label="좋지 않음"
              />
            </RadioGroup>
            {renderError(errors.basicInfo.healthStatus)}
          </FormControl>
        </Grid>
      </Grid>
    </StyledPaper>
  );

  const renderCareerInfoForm = () => (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        경력 사항을 입력해주세요
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="최근 직종"
            value={careerInfo.recentJob}
            onChange={handleCareerInfoChange('recentJob')}
            error={!!errors.careerInfo.recentJob}
            helperText={errors.careerInfo.recentJob}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="총 경력 기간"
            value={careerInfo.totalExperience}
            onChange={handleCareerInfoChange('totalExperience')}
            error={!!errors.careerInfo.totalExperience}
            helperText={errors.careerInfo.totalExperience}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="보유 기술/자격증"
            value={careerInfo.skills.join(', ')}
            onChange={(e) => {
              setCareerInfo({
                ...careerInfo,
                skills: e.target.value.split(',').map((skill) => skill.trim()),
              });
            }}
            error={!!errors.careerInfo.skills}
            helperText={errors.careerInfo.skills || "쉼표(,)로 구분하여 입력해주세요"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="선호하는 업종"
            value={careerInfo.preferredIndustry}
            onChange={handleCareerInfoChange('preferredIndustry')}
            error={!!errors.careerInfo.preferredIndustry}
            helperText={errors.careerInfo.preferredIndustry}
          />
        </Grid>
      </Grid>
    </StyledPaper>
  );

  const renderPreferencesForm = () => (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        선호도를 선택해주세요
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography gutterBottom>희망 근무 시간 (일일)</Typography>
          <Slider
            value={preferences.workingHours}
            onChange={handlePreferencesChange('workingHours')}
            min={4}
            max={12}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>체력 소모 선호도</Typography>
          <Slider
            value={preferences.physicalWork}
            onChange={handlePreferencesChange('physicalWork')}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>팀워크 중요도</Typography>
          <Slider
            value={preferences.teamwork}
            onChange={handlePreferencesChange('teamwork')}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="희망 급여"
            value={preferences.salary}
            onChange={(e) =>
              setPreferences({ ...preferences, salary: e.target.value })
            }
            error={!!errors.preferences.salary}
            helperText={errors.preferences.salary}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" error={!!errors.preferences.workEnvironment}>
            <FormLabel>선호하는 근무 환경</FormLabel>
            <RadioGroup
              value={preferences.workEnvironment}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  workEnvironment: e.target.value,
                })
              }
            >
              <FormControlLabel
                value="indoor"
                control={<Radio />}
                label="실내 근무"
              />
              <FormControlLabel
                value="outdoor"
                control={<Radio />}
                label="실외 근무"
              />
              <FormControlLabel
                value="both"
                control={<Radio />}
                label="둘 다 가능"
              />
            </RadioGroup>
            {renderError(errors.preferences.workEnvironment)}
          </FormControl>
        </Grid>
      </Grid>
    </StyledPaper>
  );

  const renderRecommendationResults = () => (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        직종 추천 결과
      </Typography>
      <Typography color="text.secondary" paragraph>
        입력하신 정보를 바탕으로 AI가 분석 중입니다...
      </Typography>
      {/* TODO: AI 추천 결과 표시 */}
    </StyledPaper>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInfoForm();
      case 1:
        return renderCareerInfoForm();
      case 2:
        return renderPreferencesForm();
      case 3:
        return renderRecommendationResults();
      default:
        return '알 수 없는 단계';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        맞춤 직종 추천
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {getStepContent(activeStep)}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {activeStep > 0 && (
          <Button onClick={handleBack} variant="outlined">
            이전
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === steps.length - 2 ? '분석 시작' : '다음'}
        </Button>
      </Box>
    </Box>
  );
};

export default HmkJobRecommendationPage; 
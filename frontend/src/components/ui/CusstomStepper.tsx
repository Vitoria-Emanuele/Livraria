//Navegação por etapas

import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface Step {
  label: string;
  description?: string;
}

interface CustomStepperProps {
  steps: Step[];
  activeStep: number;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
  children: React.ReactNode;
  isLastStep?: boolean;
  disableNext?: boolean;
}

export default function CustomStepper({
  steps,
  activeStep,
  onNext,
  onBack,
  onReset,
  children,
  isLastStep = false,
  disableNext = false
}: CustomStepperProps) {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Stepper com as etapas */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, ) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
              {step.description && (
                <Typography variant="caption" display="block">
                  {step.description}
                </Typography>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Conteúdo da etapa atual */}
      <Box sx={{ mt: 4, mb: 4 }}>
        {children}
      </Box>

      {/* Botões de navegação */}
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={onBack}
          sx={{ mr: 1 }}
        >
          Voltar
        </Button>
        
        <Box sx={{ flex: '1 1 auto' }} />
        
        <Button
           onClick={isLastStep ? onReset : onNext}
           disabled={disableNext}
           >{isLastStep ? 'Finalizar' : 'Próximo'}

        </Button>
      </Box>
    </Box>
  );
}
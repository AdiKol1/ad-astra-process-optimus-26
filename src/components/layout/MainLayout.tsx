import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import ErrorBoundary from '../shared/ErrorBoundary';
import Navigation from './Navigation';

const MainLayout: React.FC = () => {
  return (
    <ErrorBoundary>
      <Navigation />
      <Container maxW="container.xl" mt={4}>
        <Outlet />
      </Container>
    </ErrorBoundary>
  );
};

export default MainLayout;

import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Text, VStack } from '@chakra-ui/react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={6} align="center">
        <Text fontSize="6xl" fontWeight="bold">
          404
        </Text>
        <Text fontSize="2xl">
          Page Not Found
        </Text>
        <Text color="gray.600" textAlign="center">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => navigate('/')}
        >
          Go Back Home
        </Button>
      </VStack>
    </Container>
  );
};

export default NotFound;

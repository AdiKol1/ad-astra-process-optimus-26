import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdAstraChatbotWidget from '../AdAstraChatbotWidget';
import { useToast } from '../../hooks/use-toast';

// Mock the toast hook
vi.mock('../../hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn()
  }))
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock scrollIntoView
const mockScrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

describe('AdAstraChatbotWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    (useToast as any).mockReturnValue({
      toast: vi.fn()
    });
  });

  it('renders chat button when closed', () => {
    render(<AdAstraChatbotWidget />);
    expect(screen.getByRole('button', { name: /open ad astra chatbot/i })).toBeInTheDocument();
  });

  it('opens and closes chat window', () => {
    render(<AdAstraChatbotWidget />);
    
    // Open chat
    fireEvent.click(screen.getByRole('button', { name: /open ad astra chatbot/i }));
    expect(screen.getByRole('heading', { name: /chat with ad astra ai/i })).toBeInTheDocument();
    
    // Close chat
    fireEvent.click(screen.getByRole('button', { name: /close chatbot/i }));
    expect(screen.queryByRole('heading', { name: /chat with ad astra ai/i })).not.toBeInTheDocument();
  });

  it('sends message and displays response', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: 'Test response'
        }
      }]
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    render(<AdAstraChatbotWidget />);
    
    // Open chat
    fireEvent.click(screen.getByRole('button', { name: /open ad astra chatbot/i }));
    
    // Type message
    const input = screen.getByPlaceholderText('Type your question...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    // Send message
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Check if message appears
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Test response')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'));
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({ toast: mockToast });

    render(<AdAstraChatbotWidget />);
    
    // Open chat
    fireEvent.click(screen.getByRole('button', { name: /open ad astra chatbot/i }));
    
    // Type and send message
    const input = screen.getByPlaceholderText('Type your question...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Check if error toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive',
        })
      );
    });
  });

  it('handles empty messages', () => {
    render(<AdAstraChatbotWidget />);
    
    // Open chat
    fireEvent.click(screen.getByRole('button', { name: /open ad astra chatbot/i }));
    
    // Try to send empty message
    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).toBeDisabled();
  });

  it('handles Enter key for sending messages', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: 'Test response' })
    });

    render(<AdAstraChatbotWidget />);
    
    // Open chat
    fireEvent.click(screen.getByRole('button', { name: /open ad astra chatbot/i }));
    
    // Type message and press Enter
    const input = screen.getByPlaceholderText('Type your question...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    
    // Check if message was sent
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });
}); 
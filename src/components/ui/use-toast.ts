interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export const toast = (options: ToastOptions) => {
  const { title, description, variant = 'default' } = options;
  
  // For now, just console.log the toast message
  console.log(`Toast (${variant}):`, title, description);
  
  // TODO: Implement proper toast notifications
};

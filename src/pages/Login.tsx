import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/', { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate('/', { replace: true });
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <>
      <Helmet>
        <title>Login - Ad Astra Process Optimus</title>
        <meta name="description" content="Login to access your process optimization dashboard" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Login</h1>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#000000',
                      brandAccent: '#333333',
                    }
                  }
                }
              }}
              providers={[]}
              theme="light"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
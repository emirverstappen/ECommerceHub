import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const loginFormSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [location, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
      setLocation("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Giriş Yap | ModaVista</title>
        <meta 
          name="description" 
          content="ModaVista'ya giriş yapın. Hesabınıza erişin, alışverişin keyfini çıkarın." 
        />
      </Helmet>
      
      <Header />
      
      <main className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-display text-center">Giriş Yap</CardTitle>
                <CardDescription className="text-center">
                  Hesabınıza giriş yaparak alışverişe devam edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kullanıcı Adı</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="kullaniciadi" 
                              {...field}
                              className="rounded-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şifre</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field}
                              className="rounded-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between items-center">
                      <FormField
                        control={form.control}
                        name="remember"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm cursor-pointer">Beni hatırla</FormLabel>
                          </FormItem>
                        )}
                      />
                      <Link href="/forgot-password">
                        <a className="text-sm text-primary-600 hover:text-primary-700">
                          Şifremi unuttum
                        </a>
                      </Link>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-500 hover:bg-primary-600 rounded-lg" 
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </Button>
                  </form>
                </Form>
                
                <div className="relative flex items-center justify-center my-4">
                  <Separator className="flex-grow" />
                  <span className="mx-3 text-sm text-neutral-500">veya</span>
                  <Separator className="flex-grow" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="flex items-center justify-center gap-2" 
                  >
                    <i className="fab fa-google text-red-500"></i>
                    <span className="text-sm">Google</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                  >
                    <i className="fab fa-facebook-f text-blue-600"></i>
                    <span className="text-sm">Facebook</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-center text-sm text-neutral-600">
                  Hesabınız yok mu?{" "}
                  <Link href="/register">
                    <a className="text-primary-600 hover:text-primary-700 font-medium">
                      Kayıt olun
                    </a>
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

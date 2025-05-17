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
import { Checkbox } from "@/components/ui/checkbox";

const registerFormSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Kullanım koşullarını kabul etmelisiniz."
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function Register() {
  const [location, setLocation] = useLocation();
  const { register: registerUser, isAuthenticated } = useAuth();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      termsAccepted: false,
    },
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);
  
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // Convert to the format expected by the backend
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
      };
      
      await registerUser(userData);
      setLocation("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Kayıt Ol | ModaVista</title>
        <meta 
          name="description" 
          content="ModaVista'ya üye olun. Alışverişin keyfini çıkarın, kampanyalardan haberdar olun." 
        />
      </Helmet>
      
      <Header />
      
      <main className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-display text-center">Kayıt Ol</CardTitle>
                <CardDescription className="text-center">
                  Hesap oluşturarak alışverişe başlayın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Adınız" 
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
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soyad</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Soyadınız" 
                                {...field}
                                className="rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="ornek@email.com" 
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
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şifre Tekrar</FormLabel>
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
                    
                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              <span className="font-normal">
                                <Link href="/terms">
                                  <a className="text-primary-600 hover:underline">Kullanım Koşullarını</a>
                                </Link> ve <Link href="/privacy">
                                  <a className="text-primary-600 hover:underline">Gizlilik Politikasını</a>
                                </Link> okudum ve kabul ediyorum.
                              </span>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-500 hover:bg-primary-600 rounded-lg" 
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
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
                    <span className="text-sm">Google ile Kayıt</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                  >
                    <i className="fab fa-facebook-f text-blue-600"></i>
                    <span className="text-sm">Facebook ile Kayıt</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-center text-sm text-neutral-600">
                  Zaten hesabınız var mı?{" "}
                  <Link href="/login">
                    <a className="text-primary-600 hover:text-primary-700 font-medium">
                      Giriş yapın
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

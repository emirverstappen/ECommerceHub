import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginFormSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
      onClose();
      form.reset();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Sosyal Giriş",
      description: `${provider} ile giriş özelliği henüz mevcut değil.`,
      variant: "default",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold text-neutral-800">Giriş Yap</DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
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
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button 
            variant="outline"
            className="flex items-center justify-center gap-2" 
            onClick={() => handleSocialLogin("Google")}
          >
            <i className="fab fa-google text-red-500"></i>
            <span className="text-sm">Google</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin("Facebook")}
          >
            <i className="fab fa-facebook-f text-blue-600"></i>
            <span className="text-sm">Facebook</span>
          </Button>
        </div>
        
        <p className="text-center text-sm text-neutral-600">
          Hesabınız yok mu? <Link href="/register"><a className="text-primary-600 hover:text-primary-700 font-medium">Kayıt olun</a></Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}

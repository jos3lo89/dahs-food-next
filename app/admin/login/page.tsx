"use client";
import { login } from "@/actions/auth.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, LoginType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginType) => {
    setError(null);
    startTransition(async () => {
      const res = await login(data);
      if (!res.success) {
        setError(res.message);
      } else {
        reset();
        router.push("/admin/dashboard");
      }
    });
  };

  return (
    <div>
      <Card className="max-w-lg mx-auto mt-10 px-4">
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="form-login-dahs"
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                autoComplete="off"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="off"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setError(null);
              }}
              disabled={isPending}
            >
              Limpiar
            </Button>
            <Button type="submit" form="form-login-dahs" disabled={isPending}>
              {isPending ? "Iniciando..." : "Iniciar sesión"}
            </Button>
          </Field>
        </CardFooter>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Ocurrio algo inesperado.</AlertTitle>
            <AlertDescription>
              <ul className="list-inside list-disc text-sm">
                <li>{error}</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};
export default LoginPage;

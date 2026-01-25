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
        router.push("/admin");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(253,230,138,0.45),_rgba(255,255,255,0)_55%),radial-gradient(circle_at_bottom,_rgba(248,113,113,0.2),_rgba(255,255,255,0)_60%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center gap-6 text-neutral-900">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/70 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 shadow-sm">
              Acceso Dahs Jhoss
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-5xl">
                Controla los pedidos con un panel hecho para moverse rápido.
              </h1>
              <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
                Inicia sesión para administrar entregas, inventario y promociones. Todo en un mismo lugar, con foco en lo que ocurre hoy.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-200/70 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-amber-700">Pedidos</p>
                <p className="mt-2 font-medium">Vista clara del estado de cada entrega.</p>
              </div>
              <div className="rounded-2xl border border-amber-200/70 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-amber-700">Clientes</p>
                <p className="mt-2 font-medium">Sigue compras, direcciones y notas clave.</p>
              </div>
            </div>
          </section>

          <Card className="border-amber-100/80 bg-white/90 px-2 shadow-[0_25px_60px_-30px_rgba(120,53,15,0.45)] backdrop-blur">
            <CardContent className="space-y-6">
              <div className="space-y-2 pt-6">
                <h2 className="text-2xl font-semibold text-neutral-900">Bienvenida de vuelta</h2>
                <p className="text-sm text-neutral-600">
                  Usa tu correo corporativo para continuar.
                </p>
              </div>
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
              {error && (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertCircleIcon />
                  <AlertTitle>Ocurrió algo inesperado.</AlertTitle>
                  <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                      <li>{error}</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="pb-6">
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

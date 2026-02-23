"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('currentUser', JSON.stringify({ email: data.email, role: data.role }));
                router.push('/');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Credenciais inválidas');
            }
        } catch (err) {
            setError('Falha ao conectar ao servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-50 dark:bg-zinc-950 px-4">
            <div className="text-center mb-8">
                <div className="flex justify-center items-center mb-4">
                    <Clock className="w-16 h-16 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-gray-100">Painel Ponto</h1>
                <p className="text-slate-500 mt-2">Acesso restrito para colaboradores autorizados</p>
            </div>

            <Card className="w-full max-w-sm shadow-xl border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold">Login Administrativo</CardTitle>
                    <CardDescription>Insira suas credenciais abaixo</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Usuário / E-mail</Label>
                            <Input id="email" type="text" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Ex: admin" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-2" disabled={loading}>
                            {loading ? 'Redirecionando...' : (
                                <>
                                    <LogIn className="w-4 h-4 mr-2" /> Entrar no sistema
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function DatabaseSettingsPage() {
    const [host, setHost] = useState("");
    const [port, setPort] = useState("3306");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [database, setDatabase] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch('/api/settings/database')
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setHost(data.host || "");
                    setPort(data.port || "3306");
                    setUser(data.user || "");
                    setPassword(data.password || "");
                    setDatabase(data.database || "");
                }
            })
            .catch(() => console.error('Erro ao carregar configurações'));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch('/api/settings/database', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ host, port, user, password, database })
            });

            if (res.ok) {
                setMessage('Configurações salvas com sucesso no servidor.');
            } else {
                const err = await res.json();
                setMessage(err.error || 'Erro ao salvar.');
            }
        } catch (error) {
            setMessage('Erro de conexão ao salvar configurações.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Settings className="w-8 h-8 text-blue-600" /> Configurações do Sistema
                </h1>
            </div>

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" /> Conexão com Banco de Dados (MySQL)
                    </CardTitle>
                    <CardDescription>
                        Altere os parâmetros de autenticação e rede para o banco de dados principal.
                        As alterações serão gravadas nas variáveis de ambiente do servidor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="host">Host / Servidor</Label>
                                <Input id="host" value={host} onChange={e => setHost(e.target.value)} placeholder="Ex: localhost ou 192.168.1.100" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="port">Porta</Label>
                                <Input id="port" value={port} onChange={e => setPort(e.target.value)} placeholder="Ex: 3306" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user">Usuário</Label>
                                <Input id="user" value={user} onChange={e => setUser(e.target.value)} placeholder="Ex: root" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha do banco de dados" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="database">Nome do Banco de Dados</Label>
                                <Input id="database" value={database} onChange={e => setDatabase(e.target.value)} placeholder="Ex: controle_ponto" required />
                            </div>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-md text-sm border ${message.includes('sucesso') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                {message}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" disabled={loading}>
                                <Save className="w-4 h-4 mr-2" /> {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

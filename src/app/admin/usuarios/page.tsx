"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCog, Plus, Trash2 } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        setLoading(false);
        if (res.ok) {
            setName(""); setEmail(""); setPassword(""); setRole("USER");
            fetchUsers();
        } else {
            const error = await res.json();
            alert(error.error || 'Erro ao criar usuário');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Deseja realmente excluir este usuário?')) return;
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUsers();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <UserCog className="w-8 h-8 text-blue-600" /> Permissões de Usuários
                </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle>Novo Usuário</CardTitle>
                        <CardDescription>Crie acessos para administrar o sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Nível de Acesso</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">Usuário Padrão</SelectItem>
                                        <SelectItem value="RH">Recursos Humanos</SelectItem>
                                        <SelectItem value="GESTOR">Gestor</SelectItem>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-2" disabled={loading}>
                                <Plus className="w-4 h-4 mr-2" /> {loading ? 'Salvando...' : 'Cadastrar Usuário'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Usuários do Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 dark:bg-zinc-900/50">
                                        <TableHead>Nome</TableHead>
                                        <TableHead>E-mail</TableHead>
                                        <TableHead>Acesso (Role)</TableHead>
                                        <TableHead className="w-[80px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-6 text-slate-500">Nenhum usuário cadastrado.</TableCell>
                                        </TableRow>
                                    ) : users.map(u => (
                                        <TableRow key={u.id}>
                                            <TableCell className="font-medium">{u.name}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        u.role === 'RH' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                            u.role === 'GESTOR' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                    {u.role}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(u.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

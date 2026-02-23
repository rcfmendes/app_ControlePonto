"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Plus, Trash2 } from "lucide-react";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        const res = await fetch('/api/companies');
        const data = await res.json();
        setCompanies(data);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, cnpj })
        });
        setLoading(false);
        if (res.ok) {
            setName("");
            setCnpj("");
            fetchCompanies();
        } else {
            const error = await res.json();
            alert(error.error || 'Erro ao criar empresa');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Deseja realmente excluir esta empresa?')) return;
        const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
        if (res.ok) fetchCompanies();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Building className="w-8 h-8 text-blue-600" /> Gestão de Empresas
                </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle>Nova Empresa</CardTitle>
                        <CardDescription>Cadastre uma nova matriz ou filial.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Razão Social / Nome</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Tech Solutions Ltda" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ</Label>
                                <Input id="cnpj" value={cnpj} onChange={e => setCnpj(e.target.value)} required placeholder="00.000.000/0000-00" />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                <Plus className="w-4 h-4 mr-2" /> {loading ? 'Salvando...' : 'Cadastrar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Empresas Cadastradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 dark:bg-zinc-900/50">
                                        <TableHead>Nome</TableHead>
                                        <TableHead>CNPJ</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {companies.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-6 text-slate-500">Nenhuma empresa encontrada.</TableCell>
                                        </TableRow>
                                    ) : companies.map(company => (
                                        <TableRow key={company.id}>
                                            <TableCell className="font-medium">{company.name}</TableCell>
                                            <TableCell>{company.cnpj}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(company.id)}>
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

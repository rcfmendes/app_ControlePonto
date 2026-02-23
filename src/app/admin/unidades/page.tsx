"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Trash2 } from "lucide-react";

export default function UnitsPage() {
    const [units, setUnits] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUnits();
        fetchCompanies();
    }, []);

    const fetchUnits = async () => {
        const res = await fetch('/api/units');
        const data = await res.json();
        setUnits(data);
    };

    const fetchCompanies = async () => {
        const res = await fetch('/api/companies');
        const data = await res.json();
        setCompanies(data);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return alert('Selecione uma empresa.');
        setLoading(true);
        const res = await fetch('/api/units', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, companyId })
        });
        setLoading(false);
        if (res.ok) {
            setName(""); setCompanyId("");
            fetchUnits();
        } else {
            const error = await res.json();
            alert(error.error || 'Erro ao criar unidade');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Deseja realmente excluir esta unidade?')) return;
        const res = await fetch(`/api/units/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUnits();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <MapPin className="w-8 h-8 text-blue-600" /> Gestão de Unidades
                </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle>Nova Unidade</CardTitle>
                        <CardDescription>Cadastre filiais vinculadas a empresas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Empresa Responsável</Label>
                                <Select value={companyId} onValueChange={setCompanyId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome da Unidade</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Filial Centro" />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                <Plus className="w-4 h-4 mr-2" /> {loading ? 'Salvando...' : 'Cadastrar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Unidades Cadastradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 dark:bg-zinc-900/50">
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Empresa</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {units.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-6 text-slate-500">Nenhuma unidade encontrada.</TableCell>
                                        </TableRow>
                                    ) : units.map(unit => (
                                        <TableRow key={unit.id}>
                                            <TableCell className="font-medium">{unit.name}</TableCell>
                                            <TableCell>{unit.company?.name || '-'}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(unit.id)}>
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

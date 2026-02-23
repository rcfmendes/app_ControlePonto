"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Trash2 } from "lucide-react";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [journeys, setJourneys] = useState<any[]>([]);

    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [salary, setSalary] = useState("");
    const [unitId, setUnitId] = useState("");
    const [journeyId, setJourneyId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEmployees();
        fetchUnits();
        fetchJourneys();
    }, []);

    const fetchEmployees = async () => {
        const res = await fetch('/api/employees');
        setEmployees(await res.json());
    };
    const fetchUnits = async () => {
        const res = await fetch('/api/units');
        setUnits(await res.json());
    };
    const fetchJourneys = async () => {
        const res = await fetch('/api/journeys');
        setJourneys(await res.json());
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!unitId || !journeyId) return alert('Unidade e Jornada são obrigatórios.');
        setLoading(true);

        const res = await fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, cpf, email, role, salary, unitId, journeyId })
        });

        setLoading(false);
        if (res.ok) {
            setName(""); setCpf(""); setEmail(""); setRole(""); setSalary(""); setUnitId(""); setJourneyId("");
            fetchEmployees();
        } else {
            const error = await res.json();
            alert(error.error || 'Erro ao criar colaborador');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Deseja realmente excluir este colaborador?')) return;
        const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        if (res.ok) fetchEmployees();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Users className="w-8 h-8 text-blue-600" /> Colaboradores
                </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle>Novo Colaborador</CardTitle>
                        <CardDescription>Adicione membros da equipe.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input id="cpf" value={cpf} onChange={e => setCpf(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Cargo</Label>
                                    <Input id="role" value={role} onChange={e => setRole(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salary">Salário (R$)</Label>
                                    <Input id="salary" value={salary} onChange={e => setSalary(e.target.value)} placeholder="Opcional" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Unidade / Filial</Label>
                                <Select value={unitId} onValueChange={setUnitId}>
                                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        {units.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Jornada de Trabalho</Label>
                                <Select value={journeyId} onValueChange={setJourneyId}>
                                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        {journeys.map(j => <SelectItem key={j.id} value={j.id.toString()}>{j.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-2" disabled={loading}>
                                <Plus className="w-4 h-4 mr-2" /> {loading ? 'Salvando...' : 'Cadastrar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Colaboradores Cadastrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 dark:bg-zinc-900/50">
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Cargo/Salário</TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Jornada</TableHead>
                                        <TableHead className="w-[80px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-6 text-slate-500">Nenhum colaborador encontrado.</TableCell>
                                        </TableRow>
                                    ) : employees.map(emp => (
                                        <TableRow key={emp.id}>
                                            <TableCell className="font-medium">{emp.name}<br /><span className="text-xs text-slate-500">{emp.cpf}</span></TableCell>
                                            <TableCell>
                                                <div className="font-medium">{emp.role}</div>
                                                {emp.salary && <div className="text-xs text-green-600 font-semibold mt-1">R$ {emp.salary}</div>}
                                            </TableCell>
                                            <TableCell>{emp.unit?.name}</TableCell>
                                            <TableCell>{emp.journey?.name}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(emp.id)}>
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

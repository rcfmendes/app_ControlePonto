"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, CheckCircle2, XCircle } from "lucide-react";

export default function ManagementPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [vacations, setVacations] = useState<any[]>([]);
    const [justifications, setJustifications] = useState<any[]>([]);

    const [vEmpId, setVEmpId] = useState("");
    const [vStart, setVStart] = useState("");
    const [vEnd, setVEnd] = useState("");
    const [vDesc, setVDesc] = useState("");

    const [jEmpId, setJEmpId] = useState("");
    const [jDate, setJDate] = useState("");
    const [jReason, setJReason] = useState("");

    useEffect(() => {
        fetchEmployees();
        fetchVacations();
        fetchJustifications();
    }, []);

    const fetchEmployees = async () => setEmployees(await (await fetch('/api/employees')).json());
    const fetchVacations = async () => setVacations(await (await fetch('/api/vacations')).json());
    const fetchJustifications = async () => setJustifications(await (await fetch('/api/justifications')).json());

    const handleCreateVacation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vEmpId) return alert('Selecione o colaborador.');
        const res = await fetch('/api/vacations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: vEmpId, startDate: vStart, endDate: vEnd, description: vDesc })
        });
        if (res.ok) {
            setVEmpId(""); setVStart(""); setVEnd(""); setVDesc("");
            fetchVacations();
        } else alert('Erro ao registrar férias');
    };

    const handleCreateJustification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jEmpId) return alert('Selecione o colaborador.');
        const res = await fetch('/api/justifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: jEmpId, date: jDate, reason: jReason })
        });
        if (res.ok) {
            setJEmpId(""); setJDate(""); setJReason("");
            fetchJustifications();
        } else alert('Erro ao registrar justificativa');
    };

    const handleJustificationStatus = async (id: number, status: string) => {
        await fetch(`/api/justifications/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchJustifications();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-8 h-8 text-blue-600" /> Gestão de RH
                </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Férias */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-blue-100">
                        <CardHeader className="bg-blue-50/50">
                            <CardTitle>Programar Férias</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleCreateVacation} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Colaborador</Label>
                                    <Select value={vEmpId} onValueChange={setVEmpId}>
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            {employees.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Início</Label>
                                        <Input type="date" value={vStart} onChange={e => setVStart(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fim</Label>
                                        <Input type="date" value={vEnd} onChange={e => setVEnd(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Observações</Label>
                                    <Input value={vDesc} onChange={e => setVDesc(e.target.value)} placeholder="Período aquisitivo 2024..." />
                                </div>
                                <Button type="submit" className="w-full"><Plus className="w-4 h-4 mr-2" /> Registrar Férias</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader><CardTitle>Férias Programadas</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Colaborador</TableHead>
                                        <TableHead>Período</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vacations.map(v => (
                                        <TableRow key={v.id}>
                                            <TableCell>{v.employee?.name}</TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(v.startDate).toLocaleDateString('pt-BR')} até {new Date(v.endDate).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Justificativas */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-amber-100">
                        <CardHeader className="bg-amber-50/50">
                            <CardTitle>Nova Justificativa de Falta</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleCreateJustification} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Colaborador</Label>
                                    <Select value={jEmpId} onValueChange={setJEmpId}>
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            {employees.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Data da Ocorrência</Label>
                                    <Input type="date" value={jDate} onChange={e => setJDate(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Motivo / Justificativa</Label>
                                    <Input value={jReason} onChange={e => setJReason(e.target.value)} required placeholder="Atestado médico, trânsito..." />
                                </div>
                                <Button type="submit" variant="secondary" className="w-full bg-amber-100 text-amber-800 hover:bg-amber-200">
                                    <Plus className="w-4 h-4 mr-2" /> Enviar Justificativa
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader><CardTitle>Justificativas Pendentes</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data / Colaborador</TableHead>
                                        <TableHead>Motivo</TableHead>
                                        <TableHead>Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {justifications.filter(j => j.status === 'PENDING').map(j => (
                                        <TableRow key={j.id}>
                                            <TableCell className="text-sm font-medium">
                                                {new Date(j.date).toLocaleDateString('pt-BR')}<br />
                                                <span className="font-normal text-slate-500">{j.employee?.name}</span>
                                            </TableCell>
                                            <TableCell className="text-sm">{j.reason}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" className="text-green-600 hover:bg-green-50" onClick={() => handleJustificationStatus(j.id, 'APPROVED')}>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleJustificationStatus(j.id, 'REJECTED')}>
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {justifications.filter(j => j.status === 'PENDING').length === 0 && (
                                        <TableRow><TableCell colSpan={3} className="text-center text-slate-500">Nenhuma pendência.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

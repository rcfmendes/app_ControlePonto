"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Search } from "lucide-react";

export default function ReportsPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [employeeId, setEmployeeId] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/employees').then(res => res.json()).then(data => setEmployees(data));

        // Default to first and last day of current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) return alert("Período é obrigatório");

        setLoading(true);
        try {
            let url = `/api/reports/hours?startDate=${startDate}&endDate=${endDate}`;
            if (employeeId !== "all") {
                url += `&employeeId=${employeeId}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            setReports(data || []);
        } catch (err) {
            alert("Erro ao buscar relatórios");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BarChart3 className="w-8 h-8 text-blue-600" /> Relatórios e Horas
                </h1>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Colaborador</Label>
                            <Select value={employeeId} onValueChange={setEmployeeId}>
                                <SelectTrigger><SelectValue placeholder="Todos os Colaboradores" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Colaboradores</SelectItem>
                                    {employees.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Data Inicial</Label>
                            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Data Final</Label>
                            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            <Search className="w-4 h-4 mr-2" /> {loading ? 'Buscando...' : 'Gerar Relatório'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Resultados</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-zinc-900/50">
                                <TableHead>Colaborador</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Registros</TableHead>
                                <TableHead className="text-right">Total Horas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                                        Nenhum registro encontrado para o período.
                                    </TableCell>
                                </TableRow>
                            ) : reports.map((r, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{r.employeeName}</TableCell>
                                    <TableCell>{new Date(r.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        <ul className="list-disc list-inside">
                                            {r.records.map((rec: any) => (
                                                <li key={rec.id}>
                                                    {rec.type}: {new Date(rec.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    {rec.adjusted && <span className="ml-2 text-xs text-amber-600 font-semibold">(Ajustado)</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-blue-700">
                                        {r.totalTimeFormatted}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

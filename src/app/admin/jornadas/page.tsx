"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Plus, Trash2 } from "lucide-react";

export default function JourneysPage() {
    const [journeys, setJourneys] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [dayOfWeek, setDayOfWeek] = useState("");
    const [entry1, setEntry1] = useState("");
    const [exit1, setExit1] = useState("");
    const [entry2, setEntry2] = useState("");
    const [exit2, setExit2] = useState("");
    const [totalHours, setTotalHours] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJourneys();
    }, []);

    const fetchJourneys = async () => {
        const res = await fetch('/api/journeys');
        const data = await res.json();
        setJourneys(data);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/journeys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, dayOfWeek, entry1, exit1, entry2, exit2, totalHours })
        });
        setLoading(false);
        if (res.ok) {
            setName(""); setDayOfWeek(""); setEntry1(""); setExit1(""); setEntry2(""); setExit2(""); setTotalHours("");
            fetchJourneys();
        } else {
            const error = await res.json();
            alert(error.error || 'Erro ao criar jornada');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Deseja realmente excluir?')) return;
        const res = await fetch(`/api/journeys/${id}`, { method: 'DELETE' });
        if (res.ok) fetchJourneys();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="w-8 h-8 text-blue-600" /> Gestão de Jornadas
                </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle>Nova Jornada</CardTitle>
                        <CardDescription>Configure os horários detalhados de trabalho.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome da Jornada</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Operacional Manhã" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dayOfWeek">Dia da Semana</Label>
                                <Input id="dayOfWeek" value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)} required placeholder="Ex: Segunda-feira" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="entry1">Entrada Inicial</Label>
                                    <Input id="entry1" type="time" value={entry1} onChange={e => setEntry1(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="exit1">Saída Almoço</Label>
                                    <Input id="exit1" type="time" value={exit1} onChange={e => setExit1(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="entry2">Retorno Almoço</Label>
                                    <Input id="entry2" type="time" value={entry2} onChange={e => setEntry2(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="exit2">Saída Final</Label>
                                    <Input id="exit2" type="time" value={exit2} onChange={e => setExit2(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalHours">Total Horas Jornada</Label>
                                <Input id="totalHours" value={totalHours} onChange={e => setTotalHours(e.target.value)} required placeholder="Ex: 08:00" />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                <Plus className="w-4 h-4 mr-2" /> {loading ? 'Salvando...' : 'Cadastrar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Jornadas Cadastradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 dark:bg-zinc-900/50">
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Dia</TableHead>
                                        <TableHead>Turno 1</TableHead>
                                        <TableHead>Turno 2</TableHead>
                                        <TableHead>Total Horas</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {journeys.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-slate-500">Nenhuma jornada encontrada.</TableCell>
                                        </TableRow>
                                    ) : journeys.map(j => (
                                        <TableRow key={j.id}>
                                            <TableCell className="font-medium">{j.name}</TableCell>
                                            <TableCell>{j.dayOfWeek}</TableCell>
                                            <TableCell>{j.entry1} - {j.exit1}</TableCell>
                                            <TableCell>{j.entry2} - {j.exit2}</TableCell>
                                            <TableCell>{j.totalHours}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(j.id)}>
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

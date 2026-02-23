"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [time, setTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<{ email: string, role: string } | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setCurrentUser(parsed);

          if (parsed.role === 'USER') {
            const myEmployee = data.find((e: any) => e.email === parsed.email || e.cpf === parsed.email);
            if (myEmployee) {
              setEmployeeId(myEmployee.id.toString());
            }
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleRegister = async (type: string) => {
    if (!employeeId) {
      alert("Por favor, selecione seu nome.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          type,
          timestamp: new Date().toISOString()
        })
      });

      if (res.ok) {
        setSuccessMsg(`Ponto registrado com sucesso: ${type}`);
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao registrar ponto");
      }
    } catch (err) {
      alert("Erro de conexão ao registrar ponto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center justify-center gap-4">
          <Clock className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
          {time ? time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
        </h1>
        <p className="text-xl text-slate-500 font-medium mt-4">
          {time ? time.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Carregando...'}
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-zinc-800">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Registro de Ponto</CardTitle>
          <CardDescription>Selecione seu nome e registre a batida</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Select value={employeeId} onValueChange={setEmployeeId} disabled={currentUser?.role === 'USER'}>
              <SelectTrigger className="w-full text-lg h-12">
                <SelectValue placeholder="Selecione o Colaborador" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name} ({emp.cpf})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {successMsg && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2 text-sm font-medium border border-green-200 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              size="lg"
              className="w-full h-16 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleRegister('ENTRY1')}
              disabled={loading}
            >
              Entrada Inicial (1)
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full h-16 text-base font-semibold border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
              onClick={() => handleRegister('EXIT1')}
              disabled={loading}
            >
              Saída Almoço (2)
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full h-16 text-base font-semibold border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => handleRegister('ENTRY2')}
              disabled={loading}
            >
              Retorno Almoço (3)
            </Button>
            <Button
              size="lg"
              className="w-full h-16 text-base font-semibold bg-slate-800 hover:bg-slate-900 text-white"
              onClick={() => handleRegister('EXIT2')}
              disabled={loading}
            >
              Saída Final (4)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

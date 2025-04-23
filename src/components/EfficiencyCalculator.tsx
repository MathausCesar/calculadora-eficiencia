"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  LineChart,
  Line,
} from "recharts";

// Perfis e automação
const profileOptions = [
  { value: "massificado", label: "Massificado", capacity: 600, salaryFloor: 3500 },
  { value: "fullservice", label: "Full Service", capacity: 250, salaryFloor: 6000 },
  { value: "boutique", label: "Boutique", capacity: 120, salaryFloor: 10000 },
  { value: "convencional", label: "Convencional", capacity: 200, salaryFloor: 5000 },
];
const automationOptions = [
  { value: 1.0, label: "Nenhuma" },
  { value: 0.85, label: "Planilha" },
  { value: 0.6, label: "Sistema Próprio" },
  { value: 0.5, label: "ERP Jurídico" },
];

export default function EfficiencyCalculator() {
  // Entradas
  const [profile, setProfile] = useState("massificado");
  const [P, setP] = useState(0);
  const [L, setL] = useState(1);
  const [dailyMin, setDailyMin] = useState(0);
  const [A, setA] = useState(1.0);
  const D = 22; // dias úteis

  // Resultados
  const [lostHours, setLostHours] = useState(0);
  const [lostCost, setLostCost] = useState(0);
  const [warning, setWarning] = useState("");

  // Recalcula métricas sempre que as entradas mudam
  useEffect(() => {
    const cfg = profileOptions.find((p) => p.value === profile);
    if (!cfg || L < 1) {
      setLostHours(0);
      setLostCost(0);
      setWarning("");
      return;
    }
    const R = P / (cfg.capacity * L);
    setWarning(R > 2 ? "⚠️ Sobrecarga extrema (R > 2)" : "");
    const repDay = (dailyMin / 60) * R;
    const baseH = L * repDay * D;
    const lostH = Math.round(baseH * A);
    setLostHours(lostH);
    setLostCost(Math.round((lostH * cfg.salaryFloor) / (D * 8)));
  }, [profile, P, L, dailyMin, A]);

  // Dados para gráficos
  const perProf = L > 0 ? P / L : 0;
  const chartProc = [
    { name: "Você", value: Math.round(perProf) },
    { name: "Concorrência", value: Math.round(perProf * 1.1) },
    { name: "OfficeADV", value: Math.round(perProf * 1.25) },
    { name: "CPJ-3C", value: Math.round(perProf * 1.4) },
  ];
  const chartTime = [
    { name: "Você", value: -lostHours },
    { name: "Concorrência", value: Math.round(lostHours * 0.1) },
    { name: "OfficeADV", value: Math.round(lostHours * 0.25) },
    { name: "CPJ-3C", value: Math.round(lostHours * 0.4) },
  ];
  const chartCost = [
    { name: "Você", value: -lostCost },
    { name: "Concorrência", value: 0 },
    { name: "OfficeADV", value: Math.round(lostCost * 0.25) },
    { name: "CPJ-3C", value: Math.round(lostCost * 0.4) },
  ];

  const barGrad = "barGrad";
  const waveGrad = "waveGrad";

  return (
    <div className="p-8 bg-gray-900 text-gray-100 rounded-2xl max-w-xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-cyan-400">Calculadora de Eficiência Jurídica</h2>
      {warning && <div className="p-2 bg-yellow-700 rounded">{warning}</div>}

      {/* Entradas */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400">Perfil do Escritório</label>
          <select
            className="w-full bg-gray-800 p-2 rounded"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          >
            {profileOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400">Processos ativos</label>
          <input
            type="number"
            className="w-full bg-gray-800 p-2 rounded"
            value={P}
            onChange={(e) => setP(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400">Profissionais jurídicos</label>
          <input
            type="number"
            min={1}
            className="w-full bg-gray-800 p-2 rounded"
            value={L}
            onChange={(e) => setL(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400">Tempo diário em rotinas (min)</label>
          <input
            type="number"
            className="w-full bg-gray-800 p-2 rounded"
            value={dailyMin}
            onChange={(e) => setDailyMin(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400">Automação</label>
          <select
            className="w-full bg-gray-800 p-2 rounded"
            value={A}
            onChange={(e) => setA(Number(e.target.value))}
          >
            {automationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Horas desperdiçadas/mês</div>
          <div className="text-xl font-semibold">{lostHours} h</div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">R$ desperdiçados/mês</div>
          <div className="text-xl font-semibold">R$ {lostCost}</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="space-y-6">
        {/* Processos */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="text-cyan-300 mb-2">Processos por Profissional</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartProc}>
              <defs>
                <linearGradient id={barGrad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38a169" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3182ce" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#444" strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: "#aaa" }} />
              <YAxis tick={{ fill: "#aaa" }} />
              <Tooltip
                cursor={false}
                contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8 }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#aaa" }}
              />
              <Bar dataKey="value" fill={`url(#${barGrad})`} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fill: "#fff", fontSize: 12 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tempo */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="text-cyan-300 mb-2">Tempo Ganhado (h)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartTime}>
              <defs>
                <linearGradient id={barGrad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e53e3e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#38a169" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#444" strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: "#aaa" }} />
              <YAxis tick={{ fill: "#aaa" }} />
              <Tooltip
                cursor={false}
                contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8 }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#aaa" }}
                formatter={(v: number) => [`${v}h`, "Ganho"]}
              />
              <Bar dataKey="value" fill={`url(#${barGrad})`} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fill: "#fff", fontSize: 12 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Custo */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="text-cyan-300 mb-2">Comparação de Custo (R$)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartCost}>
              <defs>
                <linearGradient id={waveGrad} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e53e3e" />
                  <stop offset="50%" stopColor="#38a169" />
                  <stop offset="100%" stopColor="#3182ce" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#444" strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: "#aaa" }} />
              <YAxis tick={{ fill: "#aaa" }} />
              <Tooltip
                cursor={false}
                contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8 }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#aaa" }}
                formatter={(v: number) => [`R$ ${v}`, "Custo"]}
                labelFormatter={(l: string) => `Operação: ${l}`}
              />
              <Line type="monotone" dataKey="value" stroke={`url(#${waveGrad})`} strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


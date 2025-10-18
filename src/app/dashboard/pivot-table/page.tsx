'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initialPrograms } from '@/lib/data';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function PivotTablePage() {
  const brandData = useMemo(() => {
    const dataByBrand: Record<string, { achievement: number; payment: number }> = {};

    initialPrograms.forEach((program) => {
      if (!dataByBrand[program.brand]) {
        dataByBrand[program.brand] = { achievement: 0, payment: 0 };
      }
      dataByBrand[program.brand].achievement += program.pencapaian;
      dataByBrand[program.brand].payment += program.pencapaian * program.rewardValue;
    });

    return Object.entries(dataByBrand).map(([brand, values]) => ({
      name: brand,
      achievement: values.achievement,
      payment: values.payment,
    }));
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">{payload[0].name}</span>
                <span className="font-bold">{data.name}</span>
            </div>
            <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Value</span>
                <span className="font-bold">
                    {payload[0].dataKey === 'payment' ? formatCurrency(payload[0].value) : payload[0].value.toLocaleString()}
                </span>
            </div>
          </div>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Achievement by Brand</CardTitle>
          <CardDescription>Total achievement units per brand.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="achievement"
                >
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment by Brand</CardTitle>
          <CardDescription>Total payment (reward) per brand.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="payment"
                >
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

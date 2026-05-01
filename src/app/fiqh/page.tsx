
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function FiqhPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Scale className="mr-3 h-8 w-8 text-primary" /> Fiqh (Islamic Jurisprudence)
          </CardTitle>
          <CardDescription>
            Explore texts on Islamic jurisprudence. This section is under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center">
          <Scale className="h-24 w-24 text-muted-foreground mb-6" />
          <p className="text-xl text-muted-foreground">
            Fiqh library content will be available here.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Integration with sources like Fatawa Rizwiya Shareef, Jaddul Mumtar Shareef, Bahar-e-Shariat, and Fatawa Alamgiri (via Internet Archive) is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

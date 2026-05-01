
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";

export default function TafsirPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <MessageSquareText className="mr-3 h-8 w-8 text-primary" /> Tafsir (Quranic Exegesis)
          </CardTitle>
          <CardDescription>
            Delve into Quranic exegesis from various scholars. This section is under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center">
          <MessageSquareText className="h-24 w-24 text-muted-foreground mb-6" />
          <p className="text-xl text-muted-foreground">
            Tafsir library content will be available here.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Integration with renowned Ahl-e-Sunnat commentaries like Tafsir-e-Jalalain (with authentic Sunni commentary), Tafsir-e-Naeemi, Khazain-ul-Irfan, and Rooh-ul-Bayan is planned. These may leverage sources like Shamela.ws (if feasible) or other digital repositories.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

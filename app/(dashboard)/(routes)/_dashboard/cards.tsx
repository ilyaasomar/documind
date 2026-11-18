import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
interface TopCardsProps {
  data: {
    document_title: string;
    document_count: number;
    no_question_title: string;
    no_questions: number;
    no_question_title_this_month: string;
    no_questions_this_month: number;
  };
}
const TopCards = ({ key, data }: { key: number; data: any }) => {
  return (
    <div key={key} className="flex flex-col gap-3 shadow-md rounded-lg border py-5">
      <div className="flex items-center justify-between px-4">
        <span className="text-sm text-muted-foreground">{data.title}</span>
      </div>
      <div className="flex items-center gap-3 px-4">
        <p className="text-3xl font-semibold">{data.count}</p>
      </div>
    </div>
  );
};

export default TopCards;

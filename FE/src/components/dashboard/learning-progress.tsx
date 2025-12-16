"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Skill {
  name: string;
  progress: number;
  color: string;
  score: number;
}

export function LearningProgress() {
  const skills: Skill[] = [
    { name: "Reading", progress: 85, color: "bg-blue-600", score: 8.5 },
    { name: "Listening", progress: 75, color: "bg-green-600", score: 7.5 },
    { name: "Writing", progress: 70, color: "bg-orange-600", score: 7.0 },
    { name: "Speaking", progress: 65, color: "bg-purple-600", score: 6.5 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiến độ học tập</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="text-sm text-muted-foreground">
                {skill.score}/10
              </span>
            </div>
            <Progress value={skill.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

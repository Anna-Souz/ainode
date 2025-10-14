"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDashboardService } from "@/lib/dashboard-service"
import { Brain, Target, TrendingUp, Play, Clock, Award, RefreshCw } from "lucide-react"

export function SkillsAssessment() {
  const { state, actions } = useDashboardService()

  const handleStartQuiz = (quizId: string) => {
    actions.startQuiz(quizId)
  }

  const handleRetakeQuiz = (quizId: string) => {
    if (confirm('Are you sure you want to retake this quiz?')) {
      actions.startQuiz(quizId)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const completedQuizzes = state.userProfile.quiz_scores_summary
  const availableQuizzes = state.quizzes.filter(quiz => 
    !completedQuizzes.some(completed => completed.quiz_id === quiz.quiz_id)
  )

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Brain className="h-5 w-5 text-blue-600" />
          Skills Assessment
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {completedQuizzes.length} completed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {/* Completed Assessments */}
        {completedQuizzes.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3 text-sm">Completed Assessments</h3>
            {completedQuizzes.slice(0, 3).map((quiz, index) => (
              <div key={index} className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{quiz.topic}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {quiz.score}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={quiz.score} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Score: {quiz.score}%</span>
                    <div className="flex items-center gap-2">
                      <span>Completed</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRetakeQuiz(quiz.quiz_id)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Available Assessments */}
        {availableQuizzes.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3 text-sm">Available Assessments</h3>
            {availableQuizzes.slice(0, 2).map((quiz, index) => (
              <div key={index} className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{quiz.topic}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {quiz.time_limit}m
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-cyan-100"
                  onClick={() => handleStartQuiz(quiz.quiz_id)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Assessment Stats */}
        {completedQuizzes.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">Avg Score</span>
                </div>
                <span className="text-lg font-bold text-blue-800">
                  {Math.round(completedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / completedQuizzes.length)}%
                </span>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Brain className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Completed</span>
                </div>
                <span className="text-lg font-bold text-green-800">{completedQuizzes.length}</span>
              </div>
            </div>
          </div>
        )}

        
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardService } from "@/lib/dashboard-service"
import { BookOpen, Users, Play, Target, TrendingUp, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { User, Edit, Plus, Award, Brain, BarChart3 } from "lucide-react"

export function LearningPath() {
  const { state, actions } = useDashboardService()
  const [isPlanIDPOpen, setIsPlanIDPOpen] = useState(false)
  const [isSkillGapOpen, setIsSkillGapOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [idpFormData, setIdpFormData] = useState({
    skill: '',
    goal: '',
    timeline: '',
    priority: 'Medium'
  })

  const handleStartCourse = (courseId: string) => {
    const course = state.courses.find(c => c.course_id === courseId)
    if (course) {
      alert(`Starting ${course.course_name}...`)
    }
  }

 

  const handlePlanIDP = () => {
    if (idpFormData.skill && idpFormData.goal) {
      alert(`IDP planned for ${idpFormData.skill}: ${idpFormData.goal}`)
      setIdpFormData({ skill: '', goal: '', timeline: '', priority: 'Medium' })
      setIsPlanIDPOpen(false)
    }
  }
    const topAssessmentScore = state.userProfile.quiz_scores_summary.length > 0 
    ? state.userProfile.quiz_scores_summary.reduce((max, quiz) => quiz.score > max.score ? quiz : max)
    : null

  // Get top 10 skills for detailed view
  const top10Skills = state.userProfile.quiz_scores_summary
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate overall learning progress
  const overallProgress = state.courses.length > 0 
    ? Math.round(state.courses.reduce((sum, course) => sum + 50, 0) / state.courses.length) // Mock progress
    : 0

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Learning Path
          <div className="ml-auto text-sm text-gray-600">
            {overallProgress}% Complete
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {topAssessmentScore && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Top Skills Assessment</h3>
                  <p className="text-sm text-gray-600">Your highest scoring assessment</p>
                </div>
              </div>
              <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-blue-300 border-blue-700"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View All Scores
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Top 10 Skills Assessment Breakdown
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {top10Skills.map((quiz, index) => (
                        <div key={quiz.quiz_id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 text-sm">#{index + 1} {quiz.topic}</span>
                            
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Score</span>
                              <span className="font-bold text-blue-600">{quiz.score}%</span>
                            </div>
                            <Progress value={quiz.score} className="h-2" />
                            <div className="text-xs text-gray-500">
                              Completed: {new Date(quiz.date_taken).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {state.userProfile.quiz_scores_summary.length < 10 && (
                      <div className="text-center py-4 text-gray-500">
                        Complete more assessments to see your full top 10 scores
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{topAssessmentScore.topic}</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    {topAssessmentScore.difficulty}
                  </Badge>
                  <span className="text-lg font-bold text-yellow-600">{topAssessmentScore.score}%</span>
                </div>
              </div>
              <Progress value={topAssessmentScore.score} className="h-2" />
              <div className="text-xs text-gray-500">
                Completed: {new Date(topAssessmentScore.date_taken).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
        {/* IDP Progress */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">IDP Progress</h3>
            <Dialog open={isPlanIDPOpen} onOpenChange={setIsPlanIDPOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Plan IDP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Plan Individual Development Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skill">Skill to Develop</Label>
                    <Input
                      id="skill"
                      value={idpFormData.skill}
                      onChange={(e) => setIdpFormData({ ...idpFormData, skill: e.target.value })}
                      placeholder="Enter skill name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal">Development Goal</Label>
                    <Textarea
                      id="goal"
                      value={idpFormData.goal}
                      onChange={(e) => setIdpFormData({ ...idpFormData, goal: e.target.value })}
                      placeholder="Describe your learning goal"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={idpFormData.timeline}
                      onChange={(e) => setIdpFormData({ ...idpFormData, timeline: e.target.value })}
                      placeholder="e.g., 3 months, 6 weeks"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={idpFormData.priority} onValueChange={(value) => setIdpFormData({ ...idpFormData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handlePlanIDP} className="flex-1">
                      Create IDP
                    </Button>
                    <Button variant="outline" onClick={() => setIsPlanIDPOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {state.courses.slice(0, 3).map((course, index) => (
              <div key={course.course_id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/90">{course.course_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Progress</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:bg-white/20 p-1"
                      onClick={() => handleStartCourse(course.course_id)}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="h-2 rounded-full bg-white/80" style={{ width: '50%' }} />
                </div>
              </div>
            ))}
            {state.courses.length === 0 && (
              <div className="text-center py-4">
                <p className="text-white/80 text-sm">No courses in progress</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
                  onClick={() => alert('Browse available courses...')}
                >
                  Browse Courses
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mentorship Links */}
        

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <Dialog open={isSkillGapOpen} onOpenChange={setIsSkillGapOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Skill Gap
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skill Gap Analysis</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">Your Current Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {state.skills.map((skill, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill.name} ({skill.level})
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-red-900 mb-2">Skills to Develop</h3>
                    <div className="space-y-2">
                      {state.jobMatches.flatMap(job => job.skill_gap).filter((skill, index, arr) => arr.indexOf(skill) === index).slice(0, 5).map((skill, index) => (
                        <div key={index} className="flex items-center justify-between bg-red-100 text-red-800 px-3 py-2 rounded-lg">
                          <span>{skill}</span>
                          <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                            Learn
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-green-900 mb-2">Recommendations</h3>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>• Focus on System Design and Kubernetes for better job matches</li>
                      <li>• Complete Advanced Algorithms course to improve coding skills</li>
                      <li>• Consider mentorship for cloud architecture guidance</li>
                    </ul>
                  </div>

                  <Button className="w-full" onClick={() => setIsSkillGapOpen(false)}>
                    Close Analysis
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alert('Opening learning recommendations...')}
            >
              <Target className="h-4 w-4 mr-2" />
              Recommendations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

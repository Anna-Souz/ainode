"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardService } from "@/lib/dashboard-service"
import { User, Edit, Plus } from "lucide-react"

export function ProfileOverview() {
  const { state, actions } = useDashboardService()
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')

  const handleSkillLevelUpdate = (skillName: string, currentLevel: number) => {
    const newLevel = prompt(`Update ${skillName} proficiency (0-100):`, currentLevel.toString())
    if (newLevel && !isNaN(Number(newLevel)) && Number(newLevel) >= 0 && Number(newLevel) <= 100) {
      actions.updateSkillLevel(skillName, Number(newLevel))
    }
  }

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      actions.addManualSkill(newSkillName.trim(), newSkillLevel)
      setNewSkillName("")
      setNewSkillLevel('Beginner')
      setIsAddSkillOpen(false)
      alert(`Added ${newSkillName.trim()} to your skills!`)
    }
  }

  const handleViewAllSkills = () => {
    alert(`Viewing all ${state.skills.length} skills...`)
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <User className="h-5 w-5 text-blue-600" />
          Profile Overview
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => alert('Opening profile editor...')}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skill Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Skill Summary</h3>
            <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skill-name">Skill Name</Label>
                    <Input
                      id="skill-name"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="Enter skill name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skill-level">Skill Level</Label>
                    <Select value={newSkillLevel} onValueChange={(value: 'Beginner' | 'Intermediate' | 'Advanced') => setNewSkillLevel(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddSkill} className="flex-1">
                      Add Skill
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddSkillOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {state.skills.slice(0, 4).map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {skill.level}
                    </Badge>
                    <span className="text-sm font-medium text-blue-600">{skill.proficiency}%</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSkillLevelUpdate(skill.name, skill.proficiency)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
            {state.skills.length > 4 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleViewAllSkills}
              >
                View All {state.skills.length} Skills
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

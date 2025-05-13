"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Tag } from "lucide-react"
import type { Category } from "./trip-expense-calculator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMobile } from "@/hooks/use-mobile"

interface CategoryManagerProps {
  categories: Category[]
  onAddCategory: (category: Category) => void
  onUpdateCategory: (category: Category) => void
  onRemoveCategory: (id: string) => void
}

export const CategoryManager = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory,
}: CategoryManagerProps) => {
  console.log("🚀 ~ categories:", categories)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("blue")
  const [editingId, setEditingId] = useState<string | null>(null)
  const isMobile = useMobile()

  const colorOptions = [
    { value: "slate", label: "Slate" },
    { value: "gray", label: "Gray" },
    { value: "zinc", label: "Zinc" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "amber", label: "Amber" },
    { value: "yellow", label: "Yellow" },
    { value: "lime", label: "Lime" },
    { value: "green", label: "Green" },
    { value: "emerald", label: "Emerald" },
    { value: "teal", label: "Teal" },
    { value: "cyan", label: "Cyan" },
    { value: "sky", label: "Sky" },
    { value: "blue", label: "Blue" },
    { value: "violet", label: "Violet" },
    { value: "purple", label: "Purple" },
    { value: "fuchsia", label: "Fuchsia" },
    { value: "pink", label: "Pink" },
    { value: "rose", label: "Rose" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    if (editingId) {
      onUpdateCategory({
        id: editingId,
        name,
        description,
        color,
      })
      setEditingId(null)
    } else {
      onAddCategory({
        id: uuidv4(),
        name,
        description,
        color,
      })
    }

    // Reset form
    setName("")
    setDescription("")
    setColor("blue")
  }

  const startEditing = (category: Category) => {
    setName(category.name)
    setDescription(category.description)
    setColor(category.color)
    setEditingId(category.id)
  }

  const cancelEditing = () => {
    setName("")
    setDescription("")
    setColor("blue")
    setEditingId(null)
  }

  const getColorClass = (colorName: string) => {
    return `bg-${colorName}-100 text-${colorName}-800 border-${colorName}-200`
  }

  const isDefaultCategory = (id: string) => {
    return ["food-veg", "food-non-veg", "drinks", "shared-expenses"].includes(id)
  }

  const getColorHex = (colorName: string): string => {
    // Map color names to hex values
    const colorMap: Record<string, string> = {
      slate: "#64748b",
      gray: "#6b7280",
      zinc: "#71717a",
      red: "#ef4444",
      orange: "#f97316",
      amber: "#f59e0b",
      yellow: "#eab308",
      lime: "#84cc16",
      green: "#22c55e",
      emerald: "#10b981",
      teal: "#14b8a6",
      cyan: "#06b6d4",
      sky: "#0ea5e9",
      blue: "#3b82f6",
      violet: "#8b5cf6",
      purple: "#a855f7",
      fuchsia: "#d946ef",
      pink: "#ec4899",
      rose: "#f43f5e"
    };
    return colorMap[colorName] || "#3b82f6"; // Default to blue
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
          <Tag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                required
                className="h-8 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="color" className="text-sm sm:text-base">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="color" className="h-8 sm:h-10 text-sm">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2"
                          style={{ backgroundColor: getColorHex(option.value) }}
                        ></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="description" className="text-sm sm:text-base">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this category"
              className="h-8 sm:h-10 text-sm"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              size={isMobile ? "sm" : "default"}
              className="h-8 sm:h-10 text-xs sm:text-sm"
            >
              {editingId ? "Update" : "Add"} Category
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEditing}
                size={isMobile ? "sm" : "default"}
                className="h-8 sm:h-10 text-xs sm:text-sm"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Categories ({categories.length})</h2>

        {categories.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No categories added yet. Add your first category above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-2 sm:p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3"
                      style={{ backgroundColor: getColorHex(category.color) }}
                    ></div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">{category.name}</h3>
                      {category.description && <p className="text-xs sm:text-sm text-gray-500">{category.description}</p>}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEditing(category)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    {!isDefaultCategory(category.id) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRemoveCategory(category.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

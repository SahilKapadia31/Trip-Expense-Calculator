"use client"

import type React from "react"

import { useState } from "react"
import type { Friend } from "./trip-expense-calculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, UserPlus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useMobile } from "@/hooks/use-mobile"

interface FriendsListProps {
  friends: Friend[]
  onAddFriend: (friend: Friend) => void
  onUpdateFriend: (friend: Friend) => void
  onRemoveFriend: (id: string) => void
}

export const FriendsList = ({ friends, onAddFriend, onUpdateFriend, onRemoveFriend }: FriendsListProps) => {
  const [name, setName] = useState("")
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [isDrinker, setIsDrinker] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const isMobile = useMobile()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    if (editingId) {
      onUpdateFriend({
        id: editingId,
        name,
        isVegetarian,
        isDrinker,
      })
      setEditingId(null)
    } else {
      onAddFriend({
        id: uuidv4(),
        name,
        isVegetarian,
        isDrinker,
      })
    }

    // Reset form
    setName("")
    setIsVegetarian(false)
    setIsDrinker(false)
  }

  const startEditing = (friend: Friend) => {
    setName(friend.name)
    setIsVegetarian(friend.isVegetarian)
    setIsDrinker(friend.isDrinker)
    setEditingId(friend.id)
  }

  const cancelEditing = () => {
    setName("")
    setIsVegetarian(false)
    setIsDrinker(false)
    setEditingId(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
          <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {editingId ? "Edit Friend" : "Add Friend"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Friend's name"
                required
                className="h-8 sm:h-10 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2 h-8 sm:h-10 mt-2 sm:mt-8">
              <Switch
                id="vegetarian"
                checked={isVegetarian}
                onCheckedChange={setIsVegetarian}
                className="scale-90 sm:scale-100"
              />
              <Label htmlFor="vegetarian" className="text-xs sm:text-sm">Vegetarian</Label>
              {/* </div>

            <div className="flex items-center space-x-2 h-8 mt-2 sm:mt-6 sm:h-10"> */}
              <Switch
                id="drinker"
                checked={isDrinker}
                onCheckedChange={setIsDrinker}
                className="scale-90 sm:scale-100"
              />
              <Label htmlFor="drinker" className="text-xs sm:text-sm">Drinks Alcohol</Label>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              size={isMobile ? "sm" : "default"}
              className="h-8 sm:h-10 text-xs sm:text-sm"
            >
              {editingId ? "Update" : "Add"} Friend
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
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Friends List ({friends.length})</h2>

        {friends.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No friends added yet. Add your first friend above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {friends.map((friend) => (
              <Card key={friend.id} className="overflow-hidden">
                <CardContent className="p-2 sm:p-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">{friend.name}</h3>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      <span className={friend.isVegetarian ? "text-green-600" : "text-gray-500"}>
                        {friend.isVegetarian ? "Vegetarian" : "Non-vegetarian"}
                      </span>
                      {" • "}
                      <span className={friend.isDrinker ? "text-amber-600" : "text-gray-500"}>
                        {friend.isDrinker ? "Drinks alcohol" : "Doesn't drink"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEditing(friend)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveFriend(friend.id)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
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

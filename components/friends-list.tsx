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
        <h2 className="flex items-center mb-2 text-lg font-semibold sm:text-xl sm:mb-4">
          <UserPlus className="w-4 h-4 mr-2 sm:h-5 sm:w-5" />
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
                className="h-8 text-sm sm:h-10"
              />
            </div>

            <div className="flex items-center h-8 mt-2 space-x-2 sm:h-10 sm:mt-8">
              <Switch
                id="vegetarian"
                checked={isVegetarian}
                onCheckedChange={setIsVegetarian}
                className="scale-90 sm:scale-100"
              />
              <Label htmlFor="vegetarian" className="text-xs sm:text-sm">Vegetarian</Label>
              {/* </div>

            <div className="flex items-center h-8 mt-2 space-x-2 sm:mt-6 sm:h-10"> */}
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
              className="h-8 text-xs sm:h-10 sm:text-sm"
            >
              {editingId ? "Update" : "Add"} Friend
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEditing}
                size={isMobile ? "sm" : "default"}
                className="h-8 text-xs sm:h-10 sm:text-sm"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold sm:text-xl sm:mb-4">Friends List ({friends.length})</h2>

        {friends.length === 0 ? (
          <p className="text-sm italic text-gray-500">No friends added yet. Add your first friend above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {friends.map((friend) => (
              <Card key={friend.id} className="overflow-hidden">
                <CardContent className="flex items-center justify-between p-2 sm:p-3">
                  <div>
                    <h3 className="text-sm font-medium sm:text-base">{friend.name}</h3>
                    <div className="mt-1 text-xs text-gray-500 sm:text-sm">
                      <span className={friend.isVegetarian ? "text-green-600" : "text-red-600"}>
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
                      <Pencil className="w-3 h-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveFriend(friend.id)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="w-3 h-3 sm:h-4 sm:w-4" />
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

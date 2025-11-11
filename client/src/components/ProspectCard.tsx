import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";
import type { Player } from "@shared/schema";

interface ProspectCardProps {
  player: Player;
  displayRank: number;
}

export function ProspectCard({ player, displayRank }: ProspectCardProps) {
  const rating = player.rating != null ? Math.min(Math.max(player.rating, 0), 100) : 0;

  return (
    <Card 
      className="flex flex-col h-full hover-elevate" 
      data-testid={`card-prospect-${player.id}`}
    >
      <div className="relative overflow-hidden rounded-t-md">
        <Badge 
          className="absolute top-3 left-3 z-10 bg-card text-card-foreground border-card-border"
          data-testid={`badge-rank-${player.id}`}
        >
          #{displayRank}
        </Badge>
        
        <div className="bg-muted flex items-center justify-center aspect-[3/4] p-4">
          {player.imagePath ? (
            <img
              src={player.imagePath}
              alt={player.name}
              className="w-full h-full object-cover"
              data-testid={`img-player-${player.id}`}
            />
          ) : (
            <Avatar className="w-32 h-32" data-testid={`avatar-player-${player.id}`}>
              <AvatarFallback className="bg-muted-foreground/20">
                <User className="w-16 h-16 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      <CardContent className="flex-1 p-4 space-y-3">
        <div>
          <h3 
            className="font-bold text-lg mb-1" 
            data-testid={`text-name-${player.id}`}
          >
            {player.name}
          </h3>
          <div className="flex gap-4 text-sm text-muted-foreground">
            {player.height && (
              <span data-testid={`text-height-${player.id}`}>
                Height: {player.height}
              </span>
            )}
            {player.position && (
              <span data-testid={`text-position-${player.id}`}>
                Position: {player.position}
              </span>
            )}
          </div>
          {player.gradeYear && (
            <div className="text-sm text-muted-foreground" data-testid={`text-class-${player.id}`}>
              Class: {player.gradeYear}
            </div>
          )}
        </div>

        {player.highSchool && (
          <div className="text-sm">
            <div className="font-semibold text-foreground">High School:</div>
            <div className="text-muted-foreground" data-testid={`text-highschool-${player.id}`}>
              {player.highSchool}
            </div>
          </div>
        )}

        {player.circuitProgram && (
          <div className="text-sm">
            <div className="font-semibold text-foreground">Circuit:</div>
            <div className="text-muted-foreground" data-testid={`text-circuit-${player.id}`}>
              {player.circuitProgram}
            </div>
          </div>
        )}

        <div className="text-sm">
          <div className="font-semibold text-foreground">College:</div>
          <div className="text-muted-foreground" data-testid={`text-college-${player.id}`}>
            {player.committedCollege || "Uncommitted"}
          </div>
        </div>

        {player.ratingComment && (
          <p 
            className="text-sm text-muted-foreground line-clamp-3" 
            data-testid={`text-comment-${player.id}`}
          >
            {player.ratingComment}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full text-sm">
          <span className="font-semibold">Rating</span>
          <span className="font-bold" data-testid={`text-rating-${player.id}`}>
            {player.rating != null ? rating : "Not rated"}
          </span>
        </div>
        <Progress value={rating} className="w-full" data-testid={`progress-rating-${player.id}`} />
      </CardFooter>
    </Card>
  );
}

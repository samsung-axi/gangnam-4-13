import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarToday, Restaurant } from '@mui/icons-material'
import { formatMacros } from '@/lib/utils'

interface RecipeCardProps {
  recipe: {
    id: string
    title: string
    tags?: string[]
    macros?: any
    ingredients?: any[]
    steps?: string[]
    tips?: string[]
    ketoized?: boolean
  }
  onAddToPlan?: (recipe: any) => void
}

export function RecipeCard({ recipe, onAddToPlan }: RecipeCardProps) {
  const macros = formatMacros(recipe.macros)

  return (
    <Card className="recipe-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{recipe.title}</CardTitle>
          {recipe.ketoized && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              키토화
            </Badge>
          )}
        </div>
        
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 매크로 영양소 */}
        {macros && (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">칼로리</div>
              <div className="font-semibold">{macros.kcal}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">탄수화물</div>
              <div className="font-semibold text-orange-600">{macros.carb}g</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">단백질</div>
              <div className="font-semibold text-blue-600">{macros.protein}g</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">지방</div>
              <div className="font-semibold text-green-600">{macros.fat}g</div>
            </div>
          </div>
        )}

        {/* 주요 재료 */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Restaurant sx={{ fontSize: 16, mr: 0.5 }} />
              주요 재료
            </h4>
            <div className="text-sm text-muted-foreground">
              {recipe.ingredients.slice(0, 3).map((ing: any) => ing.name).join(', ')}
              {recipe.ingredients.length > 3 && ` 외 ${recipe.ingredients.length - 3}개`}
            </div>
          </div>
        )}

        {/* 키토 팁 */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">💡 키토 팁</h4>
            <div className="text-sm text-muted-foreground">
              {recipe.tips[0]}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            레시피 보기
          </Button>
          {onAddToPlan && (
            <Button 
              size="sm" 
              onClick={() => onAddToPlan(recipe)}
              className="flex items-center"
            >
              <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
              일정 추가
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
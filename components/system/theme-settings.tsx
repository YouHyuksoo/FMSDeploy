"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "@/lib/theme-context"
import { Monitor, Moon, Sun, Palette, Check } from "lucide-react"
import { useTranslation } from "@/lib/language-context"

export function ThemeSettings() {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme()
  const { t } = useTranslation("theme")
  const { t: tCommon } = useTranslation("common")

  const themeOptions = [
    { value: "light", label: t("light"), icon: Sun, description: "밝은 테마" },
    { value: "dark", label: t("dark"), icon: Moon, description: "어두운 테마" },
    { value: "system", label: t("system"), icon: Monitor, description: "시스템 설정 따름" },
  ]

  const colorThemes = [
    { value: "blue", label: "블루", color: "bg-blue-500", description: "기본 블루 테마" },
    { value: "green", label: "그린", color: "bg-green-500", description: "자연스러운 그린" },
    { value: "purple", label: "퍼플", color: "bg-purple-500", description: "우아한 퍼플" },
    { value: "orange", label: "오렌지", color: "bg-orange-500", description: "활기찬 오렌지" },
    { value: "red", label: "레드", color: "bg-red-500", description: "강렬한 레드" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 다크모드 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {t("display_mode")}
            </CardTitle>
            <CardDescription>라이트 모드, 다크 모드 또는 시스템 설정을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={(value) => setTheme(value as any)}>
              {themeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex items-center gap-3 cursor-pointer">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* 색상 테마 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t("color_theme")}
            </CardTitle>
            <CardDescription>시스템의 기본 색상을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {colorThemes.map((color) => (
                <Button
                  key={color.value}
                  variant={colorTheme === color.value ? "default" : "outline"}
                  className="justify-start h-auto p-4"
                  onClick={() => setColorTheme(color.value as any)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-4 h-4 rounded-full ${color.color}`} />
                    <div className="text-left flex-1">
                      <div className="font-medium">{color.label}</div>
                      <div className="text-sm text-muted-foreground">{color.description}</div>
                    </div>
                    {colorTheme === color.value && <Check className="h-4 w-4" />}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("preview")}</CardTitle>
          <CardDescription>선택한 테마의 미리보기를 확인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-semibold mb-2">샘플 카드</h3>
              <p className="text-muted-foreground mb-4">이것은 선택한 테마가 적용된 샘플 카드입니다.</p>
              <div className="flex gap-2">
                <Button size="sm">기본 버튼</Button>
                <Button variant="outline" size="sm">
                  아웃라인 버튼
                </Button>
                <Button variant="secondary" size="sm">
                  보조 버튼
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button onClick={() => window.location.reload()}>{t("apply_theme")}</Button>
      </div>
    </div>
  )
}

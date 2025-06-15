"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/language-context"
import { TranslationDashboard } from "./translation-dashboard"
import { TranslationKeyManagement } from "./translation-key-management"
import { TranslationManagement } from "./translation-management"

export function LanguageManagement() {
  const { t } = useTranslation("language")
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("language_management", "language", "다국어 관리")}</h1>
        <p className="text-muted-foreground">
          {t("language_management_desc", "language", "시스템의 다국어 지원을 관리합니다")}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">{t("translation_dashboard", "language", "번역 대시보드")}</TabsTrigger>
          <TabsTrigger value="keys">{t("translation_keys", "language", "번역 키")}</TabsTrigger>
          <TabsTrigger value="translations">{t("translations", "language", "번역")}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <TranslationDashboard />
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
          <TranslationKeyManagement />
        </TabsContent>

        <TabsContent value="translations" className="space-y-6">
          <TranslationManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

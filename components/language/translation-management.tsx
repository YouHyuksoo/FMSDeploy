"use client"

import { useState } from "react"
import { Check, X, Clock, AlertCircle, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation, supportedLanguages } from "@/lib/language-context"
import { mockTranslationKeys, mockTranslations, getTranslationProgress } from "@/lib/mock-data/translations"
import type { SupportedLanguage, Translation } from "@/types/language"

export function TranslationManagement() {
  const { t, currentLanguage } = useTranslation("language")
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("ko")
  const [editingTranslation, setEditingTranslation] = useState<string | null>(null)

  const progressData = getTranslationProgress()
  const currentProgress = progressData.find((p) => p.language === selectedLanguage)

  // 선택된 언어의 번역 데이터
  const getTranslationsForLanguage = (language: SupportedLanguage) => {
    return mockTranslationKeys.map((key) => {
      const translation = mockTranslations.find((t) => t.keyId === key.id && t.language === language)
      return {
        key,
        translation,
      }
    })
  }

  const translationsData = getTranslationsForLanguage(selectedLanguage)

  const getStatusIcon = (translation?: Translation) => {
    if (!translation) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    if (translation.isApproved) {
      return <Check className="h-4 w-4 text-green-500" />
    }
    return <Clock className="h-4 w-4 text-orange-500" />
  }

  const getStatusBadge = (translation?: Translation) => {
    if (!translation) {
      return <Badge variant="destructive">{t("missing", "language", "누락")}</Badge>
    }
    if (translation.isApproved) {
      return <Badge variant="default">{t("approved", "language", "승인됨")}</Badge>
    }
    return <Badge variant="secondary">{t("pending", "language", "대기중")}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("translation_management", "language", "번역 관리")}</h2>
          <p className="text-muted-foreground">
            {t("translation_management_desc", "language", "언어별 번역 텍스트를 관리하고 승인합니다")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            {t("import_translations", "language", "번역 가져오기")}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("export_translations", "language", "번역 내보내기")}
          </Button>
        </div>
      </div>

      {/* 언어별 진행률 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {progressData.map((progress) => (
          <Card key={progress.language} className={selectedLanguage === progress.language ? "ring-2 ring-primary" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {supportedLanguages.find((l) => l.code === progress.language)?.flag}
                {supportedLanguages.find((l) => l.code === progress.language)?.nativeName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{progress.progress}%</span>
                  <Button
                    variant={selectedLanguage === progress.language ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(progress.language)}
                  >
                    {t("manage", "common", "관리")}
                  </Button>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>{t("completed", "language", "완료")}</span>
                    <span>{progress.translatedKeys}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("pending", "language", "대기")}</span>
                    <span>{progress.pendingKeys}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("missing", "language", "누락")}</span>
                    <span>{progress.missingKeys}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 번역 편집 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {supportedLanguages.find((l) => l.code === selectedLanguage)?.flag}
            {supportedLanguages.find((l) => l.code === selectedLanguage)?.nativeName} 번역 편집
          </CardTitle>
          <CardDescription>
            {currentProgress && (
              <>
                {currentProgress.translatedKeys}/{currentProgress.totalKeys} 완료 ({currentProgress.progress}%)
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {translationsData.map(({ key, translation }) => (
              <div key={key.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(translation)}
                    <Badge variant="outline">{key.namespace}</Badge>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{key.key}</code>
                    {getStatusBadge(translation)}
                  </div>
                  <div className="flex items-center gap-2">
                    {translation && !translation.isApproved && (
                      <Button size="sm" variant="outline">
                        <Check className="h-4 w-4 mr-1" />
                        {t("approve", "language", "승인")}
                      </Button>
                    )}
                    {translation && translation.isApproved && (
                      <Button size="sm" variant="outline">
                        <X className="h-4 w-4 mr-1" />
                        {t("reject", "language", "거부")}
                      </Button>
                    )}
                  </div>
                </div>

                {key.description && <p className="text-sm text-muted-foreground">{key.description}</p>}

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("translation_text", "language", "번역 텍스트")}</label>
                  {editingTranslation === key.id ? (
                    <div className="flex gap-2">
                      <Textarea
                        defaultValue={translation?.value || ""}
                        placeholder={t("enter_translation", "language", "번역을 입력하세요...")}
                        className="flex-1"
                      />
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => setEditingTranslation(null)}>
                          {t("save", "common", "저장")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingTranslation(null)}>
                          {t("cancel", "common", "취소")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-3 border rounded cursor-pointer hover:bg-muted/50 min-h-[60px] flex items-center"
                      onClick={() => setEditingTranslation(key.id)}
                    >
                      {translation?.value || (
                        <span className="text-muted-foreground italic">
                          {t("no_translation", "language", "번역이 없습니다. 클릭하여 추가하세요.")}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {translation && (
                  <div className="text-xs text-muted-foreground">
                    {t("last_updated", "language", "최종 수정")}: {new Date(translation.updatedAt).toLocaleDateString()}
                    by {translation.updatedBy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

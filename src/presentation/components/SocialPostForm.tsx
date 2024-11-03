"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"

export default function SocialPostForm() {
    const t = useTranslations("Index")
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPostingStatus, setShowPostingStatus] = useState(false)
    const [postingStatus, setPostingStatus] = useState<{
        twitter?: string
        threads?: string
    }>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setShowPostingStatus(true)
        setPostingStatus({
            twitter: t("posting.twitter"),
            threads: t("posting.threads")
        })

        try {
            // Post to Twitter
            const twitterResponse = await fetch("/api/twitter/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            })

            setPostingStatus(prev => ({
                ...prev,
                twitter: twitterResponse.ok ? t("posting.twitter_success") : t("posting.twitter_error")
            }))

            // Post to Threads
            const threadsResponse = await fetch("/api/threads/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            })

            setPostingStatus(prev => ({
                ...prev,
                threads: threadsResponse.ok ? t("posting.threads_success") : t("posting.threads_error")
            }))

            // Clear form after successful post
            if (twitterResponse.ok || threadsResponse.ok) {
                setContent("")
                // Keep dialog open for 2 seconds to show success
                setTimeout(() => {
                    setShowPostingStatus(false)
                    setIsLoading(false)
                }, 2000)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.error("Error posting:", error)
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <Textarea
                placeholder={t("form.placeholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px]"
            />
            <Button type="submit" disabled={!content || isLoading} className="w-full">
                {isLoading ? t("form.posting") : t("form.post")}
            </Button>

            <AlertDialog open={showPostingStatus} onOpenChange={setShowPostingStatus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("posting.title")}</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            {postingStatus.twitter && (
                                <div className="flex items-center justify-between">
                                    <span>Twitter:</span>
                                    <span>{postingStatus.twitter}</span>
                                </div>
                            )}
                            {postingStatus.threads && (
                                <div className="flex items-center justify-between">
                                    <span>Threads:</span>
                                    <span>{postingStatus.threads}</span>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    )
}

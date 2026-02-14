import { WikiViewer } from "@/components/wiki/wiki-viewer"

export default function WikiPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold lg:text-3xl">База Знаний</h1>
        <p className="text-muted-foreground">
          Полное руководство по использованию системы, регламенты и инструкции.
        </p>
      </div>
      
      <WikiViewer />
    </div>
  )
}

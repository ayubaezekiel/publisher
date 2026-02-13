import { createFileRoute } from '@tanstack/react-router'
import { DocxViewer } from '@/components/DocxViewer'
import { LexicalEditor } from '@/components/LexicalEditor'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <DocxViewer />
      <LexicalEditor />
    </div>
  )
}

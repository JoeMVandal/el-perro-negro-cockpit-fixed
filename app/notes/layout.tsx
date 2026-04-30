import { ProtectedLayout } from '@/components/ProtectedLayout'

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}

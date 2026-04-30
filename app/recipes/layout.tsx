import { ProtectedLayout } from '@/components/ProtectedLayout'

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}

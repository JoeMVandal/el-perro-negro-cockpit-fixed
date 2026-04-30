import { ProtectedLayout } from '@/components/ProtectedLayout'

export default function PrepLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}

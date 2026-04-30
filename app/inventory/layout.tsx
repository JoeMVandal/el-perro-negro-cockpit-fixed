import { ProtectedLayout } from '@/components/ProtectedLayout'

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}

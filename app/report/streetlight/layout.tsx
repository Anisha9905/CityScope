import { Toaster } from "sonner"

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  )
}

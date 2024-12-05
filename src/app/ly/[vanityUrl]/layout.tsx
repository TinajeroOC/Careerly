interface ProfileLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}

export default function ProfileLayout({ children, modal }: ProfileLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

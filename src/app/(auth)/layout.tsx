interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div className='grid min-h-dvh place-items-center'>{children}</div>
}
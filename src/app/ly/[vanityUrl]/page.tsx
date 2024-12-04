interface ProfilePageProps {
  params: Promise<{ vanityUrl: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { vanityUrl } = await params

  return <main>{vanityUrl}</main>
}

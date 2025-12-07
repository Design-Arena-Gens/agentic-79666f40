export const metadata = {
  title: 'Real Time Stancer - Assetto Corsa Stance Mod',
  description: 'VStancer-style real-time stance adjustment for Assetto Corsa using CSP Lua scripting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

import Image from 'next/image'

export function LogoIcon({ size = 48 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="El Perro Negro"
        width={size}
        height={size}
        className="w-full h-full object-contain"
      />
    </div>
  )
}

export function LogoHorizontal({ size = 200 }: { size?: number }) {
  return (
    <div style={{ width: size, height: 'auto' }}>
      <Image
        src="/logo-horizontal.png"
        alt="El Perro Negro"
        width={size}
        height={60}
        className="w-full h-auto object-contain"
      />
    </div>
  )
}

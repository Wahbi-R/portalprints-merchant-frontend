import Image from 'next/image';

export default function LogoCard({ logoURL }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg">
      <Image src={logoURL || "/profile.png"} alt="Profile Logo" className="rounded-2xl" width={0} height={0} sizes="100vw" style={{ width: '80%', height: 'auto' }} />
    </div>
  );
}
import Image from 'next/image';

export default function WinnersSection() {
  const winners = [
    { name: "Flower Pot", price: "$1,000", image: "/profile.png" },
    { name: "Flower Pot", price: "$1,000", image: "/profile.png" },
    // Add more winner items here
  ];

  return (
<div className="flex flex-wrap justify-center gap-4 p-4">
  {winners.map((winner, index) => (
    <div
      key={index}
      className="flex flex-col items-center text-white bg-gray-700 p-2 rounded-lg"
    >
      <Image src={winner.image} alt={winner.name} width={60} height={60} />
      <span className="mt-2 text-sm">{winner.name}</span>
      <span className="text-xs">{winner.price}</span>
    </div>
  ))}
</div>

  );
}
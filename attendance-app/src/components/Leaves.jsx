export default function Leaves() {
  return (
    <div className="absolute w-full h-screen pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{ left: `${Math.random() * 100}%` }}
        >
          <img src={`/img/leaf_0${(i % 4) + 1}.png`} className="w-8" />
        </div>
      ))}
    </div>
  );
}
import { useTheme } from "../context/theme.context";

const stats = [
  { value: "10K+", label: "Customers" },
  { value: "50K+", label: "Orders" },
  { value: "99%", label: "Satisfaction" },
  { value: "24Hr", label: "Delivery" },
];
export default function Stats() {
const {dark}=useTheme()
  return (
     <section id="Stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 p-10 rounded-3xl ${
            dark ? "bg-white/10" : "bg-white shadow-xl"
          }`}
        >
          {stats.map((item) => (
            <div key={item.label}>
              <h3 className="text-4xl font-black">{item.value}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

  );
}
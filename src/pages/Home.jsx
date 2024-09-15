import ChartComponent from "../Components/ChartComponents";

export default function Home() {
  // Dummy data for points over time
  const pointsData = [0, 200, 400, 600, 800, 1000, 2000, 3000, 5000, 7500, 10000];

  return (
    <section className="flex flex-col w-[90%] sm:w-[85%] overflow-y-auto">
      <div className="flex-1 p-6 bg-gray-100">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome to Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Points</h2>
            <p className="text-gray-600">10000</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Have Played</h2>
            <p className="text-gray-600">500</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Points Progress</h2>
            <p className="text-gray-600 mb-4">Journey from 0 to 10000 points</p>
            <ChartComponent points={pointsData} />
          </div>
        </div>
      </div>
    </section>
  );
}

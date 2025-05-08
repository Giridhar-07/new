import React from 'react';

function Rooms() {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Rooms</h2>
          <p className="text-gray-600">Choose your perfect room.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <img src="https://via.placeholder.com/300" alt="Standard Room" className="rounded-t-lg" />
            <h3 className="text-xl font-semibold text-gray-700 mt-2">Standard Room</h3>
            <p className="text-gray-600">Cozy and comfortable room with essential amenities.</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              View Details
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img src="https://via.placeholder.com/300" alt="Deluxe Room" className="rounded-t-lg" />
            <h3 className="text-xl font-semibold text-gray-700 mt-2">Deluxe Room</h3>
            <p className="text-gray-600">Spacious room with enhanced amenities and a city view.</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              View Details
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img src="https://via.placeholder.com/300" alt="Suite" className="rounded-t-lg" />
            <h3 className="text-xl font-semibold text-gray-700 mt-2">Suite</h3>
            <p className="text-gray-600">Luxurious suite with a separate living area and premium amenities.</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rooms;

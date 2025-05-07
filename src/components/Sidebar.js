import React from 'react';

function Sidebar() {
  return (
    <aside style={{ backgroundColor: '#f0f0f0', padding: '10px', width: '200px' }}>
      <ul>
        <li><a href="/">Dashboard</a></li>
        <li><a href="/rooms">Rooms</a></li>
        <li><a href="/reservations">Reservations</a></li>
        <li><a href="/customers">Customers</a></li>
      </ul>
    </aside>
  );
}

export default Sidebar;

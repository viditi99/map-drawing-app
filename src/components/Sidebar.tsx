import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h3>Drawing Tools</h3>
      <button>Polyline</button>
      <button>Polygon</button>
      <button>Rectangle</button>
      <button>Circle</button>
    </aside>
  );
};

export default Sidebar;

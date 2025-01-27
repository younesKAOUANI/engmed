import React from 'react';

const TabItem = ({ label, isActive, onClick }) => {
  return (
    <div
      className={`tab-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default TabItem;
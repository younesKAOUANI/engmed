import React, { useState } from "react";

const Tabs = ({ ...props }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const tabs = React.Children.map(props.children, (child, index) => ({
    label: child.props.label,
    content: child.props.children,
    index,
  }));

  const tabCount = React.Children.count(props.children);

  return (
    <div>
      <div className="flex gap-6 ">
        {tabs.map((tab) => (
          <button
            key={tab.index}
            className={`md:px-8 px-2 py-2 -mb-px font-semibold text-lg text-white rounded-lg ${
              activeTab === tab.index ? "bg-primary" : "bg-accent"
            }`}
            onClick={() => handleTabClick(tab.index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs.map(
          (tab) =>
            activeTab === tab.index && <div key={tab.index}>{tab.content}</div>
        )}
      </div>
    </div>
  );
};

export default Tabs;

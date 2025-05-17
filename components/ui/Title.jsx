import React from "react";

export default function Title({children}) {
  return (
    <div className="py-5 bg-white rounded-md text-center my-4 shadow-md">
      <h1 className="text-3xl text-primary font-bold ">{children}</h1>
    </div>
  );
}

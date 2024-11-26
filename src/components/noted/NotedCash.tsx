import React from "react";

const NotedCash = () => {
  return (
    <div className="flex items-center text-red-600 text-sm mt-8">
      <div className="underline">Note: Cash Result</div>
      <div className="ml-4">
        <div>Cash Surplus</div>
        <div>Cash Shortage</div>
      </div>
      <div className="ml-4">
        <div>
          Actual cash on hand / cash in CANADIA BANK is excess than T24 system.
          Please reconcile again
        </div>
        <div>
          Actual cash on hand / cash in CANADIA BANK is less than T24 system.
          Please reconcile again
        </div>
      </div>
    </div>
  );
};

export default NotedCash;

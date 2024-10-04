"use client";
import CenteredLoading from "@/components/centerLoading/CenteredLoading";
import { useEffect, useState } from "react";

const TestPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a data fetch
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200000));
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <CenteredLoading className="min-h-screen -mt-16"/>;
  }

  return (
    <div>
      {/* Your content here */}
      <h1>Your Content Loaded!</h1>
    </div>
  );
};

export default TestPage;

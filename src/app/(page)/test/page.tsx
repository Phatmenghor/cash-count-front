"use client"
import { useEffect, useState } from "react";
import Spinner from "@/components/centerLoading/Spinner";

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
    return <Spinner />;
  }

  return (
    <div>
      {/* Your content here */}
      <h1>Your Content Loaded!</h1>
    </div>
  );
};

export default TestPage;

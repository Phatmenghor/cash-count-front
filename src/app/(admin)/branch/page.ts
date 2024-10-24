"use client";
import { BranchesService } from "@/redux/service/branchesService";
import React, { useEffect } from "react";

const BranchPage: React.FC = () => {
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await BranchesService.getBranches();
    console.log("### ====", response);
  }
  return null;
};

export default BranchPage;

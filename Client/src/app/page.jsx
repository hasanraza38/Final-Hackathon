import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";

const HomePage = () => {
  const [loanCategories, setLoanCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLoanCategories = async () => {
      try {
        const response = await axios.get("https://final-hackathon-sigma-nine.vercel.app/api/v1/getallLoans");
        setLoanCategories(response.data);
      } catch (err) {
        setError("Failed to fetch loan categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanCategories();
  }, []);

  const handleViewDetails = (id) => {
    router.push(`/loan-category/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Loan Categories</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loanCategories.map((category) => (
          <Card key={category._id} className="shadow-md">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{category.description}</p>
              <div className="mt-4">
                <Button onClick={() => handleViewDetails(category._id)} className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

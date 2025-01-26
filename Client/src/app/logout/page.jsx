import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";

const LogoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("https://final-hackathon-sigma-nine.vercel.app/logoutuser");
      router.push("/login"); 
    } catch (err) {
      setError("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Log Out</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <p className="text-center mb-6">Are you sure you want to log out?</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={handleLogout} disabled={loading} className="w-full">
              {loading ? "Logging out..." : "Log Out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutPage;

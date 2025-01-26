import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";

const AdminPanel = () => {
  const [loanCategories, setLoanCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState({ name: "", loanCategory: "" });
  const router = useRouter();

  const fetchLoanCategories = async () => {
    try {
      const response = await axios.get("https://final-hackathon-sigma-nine.vercel.app/api/v1/getallLoans");
      setLoanCategories(response.data);
    } catch (err) {
      setError("Failed to fetch loan categories.");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("https://final-hackathon-sigma-nine.vercel.app/api/v1/getallsubcategory");
      setSubcategories(response.data);
    } catch (err) {
      setError("Failed to fetch subcategories.");
    }
  };

  const handleCreateLoanCategory = async () => {
    try {
      await axios.post("https://final-hackathon-sigma-nine.vercel.app/api/v1/createLoan", { name: newCategory });
      setNewCategory("");
      fetchLoanCategories();
    } catch (err) {
      setError("Failed to create loan category.");
    }
  };

  const handleCreateSubcategory = async () => {
    try {
      await axios.post("https://final-hackathon-sigma-nine.vercel.app/api/v1/createsubcategory", newSubcategory);
      setNewSubcategory({ name: "", loanCategory: "" });
      fetchSubcategories();
    } catch (err) {
      setError("Failed to create subcategory.");
    }
  };

  const handleDelete = async (type, id) => {
    setLoading(true);
    try {
      if (type === "loanCategory") {
        await axios.delete(`https://final-hackathon-sigma-nine.vercel.app/api/v1/deleteloan/${id}`);
        fetchLoanCategories();
      } else {
        await axios.delete(`https://final-hackathon-sigma-nine.vercel.app/api/v1/deletesubcategory/${id}`);
        fetchSubcategories();
      }
    } catch (err) {
      setError(`Failed to delete ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanCategories();
    fetchSubcategories();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Tabs defaultValue="loanCategories">
        <TabsList className="mb-4">
          <TabsTrigger value="loanCategories">Loan Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
        </TabsList>

        <TabsContent value="loanCategories">
          <Card>
            <CardHeader>
              <CardTitle>Loan Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="mb-4">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Loan Category"
                  className="mr-2"
                />
                <Button onClick={handleCreateLoanCategory} disabled={loading}>
                  Add
                </Button>
              </div>
              <ul>
                {loanCategories.map((category) => (
                  <li key={category._id} className="flex justify-between items-center mb-4">
                    <span>{category.name}</span>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete("loanCategory", category._id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcategories">
          <Card>
            <CardHeader>
              <CardTitle>Subcategories</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="mb-4">
                <Input
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  placeholder="New Subcategory Name"
                  className="mr-2"
                />
                <Input
                  value={newSubcategory.loanCategory}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, loanCategory: e.target.value })}
                  placeholder="Loan Category ID"
                  className="mr-2"
                />
                <Button onClick={handleCreateSubcategory} disabled={loading}>
                  Add
                </Button>
              </div>
              <ul>
                {subcategories.map((subcategory) => (
                  <li key={subcategory._id} className="flex justify-between items-center mb-4">
                    <span>{subcategory.name}</span>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete("subcategory", subcategory._id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router";
interface LeetCodeProblem {
  Difficulty: "EASY" | "MEDIUM" | "HARD";
  Title: string;
  Frequency: number;
  "Acceptance Rate": number;
  Link: string;
  Topics: string;
}

const LeetCodeCompanyProblems: React.FC = () => {
  const { company } = useParams();
  const [companyProblems, setCompanyProblems] = useState<LeetCodeProblem[]>([]);
  // const companyProblems = problemsData[company as keyof typeof problemsData];
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LeetCodeProblem | null;
    direction: "ascending" | "descending";
  }>({
    key: "Frequency",
    direction: "descending",
  });
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/merged_questions.json");
      const data = await response.json();
      console.log(data[company as string]);
      setCompanyProblems(data[company as string]);
    };
    fetchData();
  }, []);
  // Filter problems based on search term and difficulty
  const filteredProblems = companyProblems.filter((problem) => {
    const matchesSearch =
      problem.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.Topics.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "ALL" || problem.Difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Sort the filtered problems
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sorting when a column header is clicked
  const requestSort = (key: keyof LeetCodeProblem) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get the sort direction indicator
  const getSortDirectionIndicator = (key: keyof LeetCodeProblem) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  // Render difficulty badge with appropriate color
  const renderDifficultyBadge = (difficulty: string) => {
    let badgeClass = "";

    switch (difficulty) {
      case "EASY":
        badgeClass = "bg-green-500 hover:bg-green-600";
        break;
      case "MEDIUM":
        badgeClass = "bg-yellow-500 hover:bg-yellow-600";
        break;
      case "HARD":
        badgeClass = "bg-red-500 hover:bg-red-600";
        break;
    }

    return <Badge className={badgeClass}>{difficulty}</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{company} LeetCode Problems</CardTitle>
      </CardHeader>
      {companyProblems.length === 0 && (
        <CardContent>
          <div className="text-center py-6">
            <div className="text-gray-500">Loading problems...</div>
          </div>
        </CardContent>
      )}
      {companyProblems.length !== 0 && (
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by title or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="text-white">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Difficulties</SelectItem>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-20 cursor-pointer"
                    onClick={() => requestSort("Difficulty")}
                  >
                    Difficulty {getSortDirectionIndicator("Difficulty")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("Title")}
                  >
                    Title {getSortDirectionIndicator("Title")}
                  </TableHead>
                  <TableHead
                    className="w-24 text-right cursor-pointer"
                    onClick={() => requestSort("Frequency")}
                  >
                    Frequency {getSortDirectionIndicator("Frequency")}
                  </TableHead>
                  <TableHead
                    className="w-32 text-right cursor-pointer"
                    onClick={() => requestSort("Acceptance Rate")}
                  >
                    Acceptance {getSortDirectionIndicator("Acceptance Rate")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Topics</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProblems.map((problem, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-4">
                      {renderDifficultyBadge(problem.Difficulty)}
                    </TableCell>
                    <TableCell className="font-medium py-4">
                      <a
                        href={problem.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {problem.Title}
                      </a>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {problem.Frequency}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {(problem["Acceptance Rate"] * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-4">
                      <div className="flex flex-wrap gap-1">
                        {problem.Topics.split(", ").map((topic, i) => (
                          <Badge key={i} variant="outline">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedProblems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No problems found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Showing {sortedProblems.length} of {companyProblems.length} problems
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default LeetCodeCompanyProblems;

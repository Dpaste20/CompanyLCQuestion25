import React, { useEffect, useState } from "react";
import Confetti from 'react-confetti';
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
import { useParams, useNavigate } from "react-router";
import { CheckIcon, FileTextIcon, PencilIcon, Home } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface LeetCodeProblem {
  Difficulty: "EASY" | "MEDIUM" | "HARD";
  Title: string;
  Frequency: number;
  "Acceptance Rate": number;
  Link: string;
  Topics: string;
  solved?: boolean;
  notes?: string;
}

const ITEMS_PER_PAGE = 25;

const LeetCodeCompanyProblems: React.FC = () => {
  const { company } = useParams();
  const navigate = useNavigate();
  const [companyProblems, setCompanyProblems] = useState<LeetCodeProblem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [solvedFilter, setSolvedFilter] = useState<string>("ALL");
  const [currentNote, setCurrentNote] = useState("");
  const [currentProblemTitle, setCurrentProblemTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LeetCodeProblem | null;
    direction: "ascending" | "descending";
  }>({
    key: "Frequency",
    direction: "descending",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/merged_questions.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Data loaded, available companies:", Object.keys(data));
        
        interface CompanyData {
          [key: string]: LeetCodeProblem[];
        }

        const findCompanyData = (data: CompanyData, searchCompany: string): LeetCodeProblem[] => {
          if (data[searchCompany]) {
            return data[searchCompany];
          }
          
          const companyKey = Object.keys(data).find(
            key => key.toLowerCase() === searchCompany.toLowerCase()
          );
          
          if (companyKey) {
            return data[companyKey];
          }
          
          const normalizedSearchName = searchCompany.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          for (const key of Object.keys(data)) {
            const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normalizedKey === normalizedSearchName) {
              return data[key];
            }
          }
          
          console.error(`Company "${searchCompany}" not found in data. Available companies:`, Object.keys(data));
          return [];
        };
        
        let companyProblems = findCompanyData(data, company as string);
        
        const savedSolvedStatus = localStorage.getItem(`${company}-solved-problems`);
        const savedNotes = localStorage.getItem(`${company}-problem-notes`);
        
        let problemsWithSavedData = Array.isArray(companyProblems) ? companyProblems : [];
        
        if (problemsWithSavedData.length > 0) {
          if (savedSolvedStatus || savedNotes) {
            const solvedMap = savedSolvedStatus ? JSON.parse(savedSolvedStatus) : {};
            const notesMap = savedNotes ? JSON.parse(savedNotes) : {};
            
            problemsWithSavedData = problemsWithSavedData.map((problem: LeetCodeProblem) => ({
              ...problem,
              solved: solvedMap[problem.Title] || false,
              notes: notesMap[problem.Title] || ""
            }));
          } else {
            problemsWithSavedData = problemsWithSavedData.map((problem: LeetCodeProblem) => ({
              ...problem,
              solved: false,
              notes: ""
            }));
          }
        }
        
        setCompanyProblems(problemsWithSavedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [company]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, difficultyFilter, solvedFilter]);

  useEffect(() => {
    if (companyProblems.length > 0) {
      const problemData = companyProblems.map(problem => ({
        Title: problem.Title,
        Difficulty: problem.Difficulty
      }));
      localStorage.setItem(`${company}-problem-data`, JSON.stringify(problemData));
    }
  }, [companyProblems, company]);

  const toggleSolvedStatus = (title: string) => {
    const updatedProblems = companyProblems.map(problem => {
      if (problem.Title === title) {
        const newSolvedStatus = !problem.solved;
        if (problem.Difficulty === "HARD" && !problem.solved && newSolvedStatus) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        }
        return { ...problem, solved: newSolvedStatus };
      }
      return problem;
    });
    setCompanyProblems(updatedProblems);
    
    const solvedMap = updatedProblems.reduce((acc, problem) => {
      acc[problem.Title] = problem.solved ?? false;
      return acc;
    }, {} as Record<string, boolean>);
    
    localStorage.setItem(`${company}-solved-problems`, JSON.stringify(solvedMap));
  };

  const updateNotes = () => {
    const updatedProblems = companyProblems.map(problem => 
      problem.Title === currentProblemTitle ? { ...problem, notes: currentNote } : problem
    );
    setCompanyProblems(updatedProblems);
    
    const notesMap = updatedProblems.reduce((acc, problem) => {
      acc[problem.Title] = problem.notes || "";
      return acc;
    }, {} as Record<string, string>);
    
    localStorage.setItem(`${company}-problem-notes`, JSON.stringify(notesMap));
  };

  const openNotesEditor = (title: string, notes: string = "") => {
    setCurrentProblemTitle(title);
    setCurrentNote(notes);
  };

  const filteredProblems = companyProblems.filter((problem) => {
    const matchesSearch =
      problem.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.Topics.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "ALL" || problem.Difficulty === difficultyFilter;
    const matchesSolved = 
      solvedFilter === "ALL" || 
      (solvedFilter === "SOLVED" && problem.solved) || 
      (solvedFilter === "UNSOLVED" && !problem.solved);
    
    return matchesSearch && matchesDifficulty && matchesSolved;
  });

  const difficultyOrder = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3
  };

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === "solved") {
      return sortConfig.direction === "ascending"
        ? (a.solved ? 1 : 0) - (b.solved ? 1 : 0)
        : (b.solved ? 1 : 0) - (a.solved ? 1 : 0);
    }

    if (sortConfig.key === "Difficulty") {
      const aValue = difficultyOrder[a.Difficulty];
      const bValue = difficultyOrder[b.Difficulty];
      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if ((aValue ?? 0) < (bValue ?? 0)) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if ((aValue ?? 0) > (bValue ?? 0)) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, sortedProblems.length);
  const currentPageProblems = sortedProblems.slice(startIndex, endIndex);

  const requestSort = (key: keyof LeetCodeProblem) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionIndicator = (key: keyof LeetCodeProblem) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

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

  const generatePaginationItems = () => {
    const items = [];
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (totalPages > 7) {
      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } 
      else if (currentPage >= totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 4; i < totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } 
      else {
        items.push(
          <PaginationItem key="ellipsis3">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis4">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      if (totalPages > 1) {
        items.push(
          <PaginationItem key="last">
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return items;
  };

  const CustomCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => {
    return (
      <div 
        className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center ${
          checked 
            ? "bg-green-500 border-green-500" 
            : "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
        }`}
        onClick={onChange}
      >
        {checked && <CheckIcon className="h-4 w-4 text-white" />}
      </div>
    );
  };

  return (
    <div className="relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={1000}
          gravity={0.3}
          recycle={false}
        />
      )}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{company} LeetCode Problems</CardTitle>
          <div className="flex gap-2 ">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/notes/${company}`)}
              style={{ backgroundColor: 'rgb(27, 27, 28)', color: 'rgb(240, 243, 245)' }}
              className="flex items-center gap-2 "
            >
              <FileTextIcon className="h-4 w-4" />
              View Notes
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
              style={{ backgroundColor: 'rgb(27, 27, 28)', color: 'rgb(240, 243, 245)' }}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </CardHeader>
        {isLoading && (
          <CardContent>
            <div className="text-center py-6">
              <div className="text-gray-500">Loading problems just for you...</div>
            </div>
          </CardContent>
        )}
        {!isLoading && companyProblems.length === 0 && (
          <CardContent>
            <div className="text-center py-6">
              <div className="text-gray-500">No problems found for this company</div>
            </div>
          </CardContent>
        )}
        {!isLoading && companyProblems.length > 0 && (
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
              <div className="w-full sm:w-48">
                <Select
                  value={solvedFilter}
                  onValueChange={setSolvedFilter}
                >
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder="Filter by solved status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Problems</SelectItem>
                    <SelectItem value="SOLVED">Solved</SelectItem>
                    <SelectItem value="UNSOLVED">Unsolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
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
                    <TableHead
                      className="w-16 cursor-pointer text-center"
                      onClick={() => requestSort("solved" as keyof LeetCodeProblem)}
                    >
                      Solved {getSortDirectionIndicator("solved" as keyof LeetCodeProblem)}
                    </TableHead>
                    <TableHead
                      className="w-16 text-center"
                    >
                      Notes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageProblems.map((problem, index) => (
                    <TableRow key={index} className={problem.solved ? "bg-green-50 dark:bg-green-900/10" : ""}>
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
                      <TableCell className="py-4 text-center">
                        <div className="flex justify-center">
                          <CustomCheckbox 
                            checked={problem.solved || false} 
                            onChange={() => toggleSolvedStatus(problem.Title)} 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="relative rounded-full h-8 w-8"
                              onClick={() => openNotesEditor(problem.Title, problem.notes)}
                            >
                              {problem.notes && problem.notes.length > 0 ? (
                                <FileTextIcon className="h-5 w-5 text-blue-500" />
                              ) : (
                                <PencilIcon className="h-5 w-5 text-gray-400" />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Notes for {problem.Title}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Textarea
                                placeholder="Add your notes, hints, or solution approaches here..."
                                value={currentNote}
                                onChange={(e) => setCurrentNote(e.target.value)}
                                className="min-h-[200px]"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <DialogClose asChild>
                                <Button variant="outline"
                                 style={{ backgroundColor: 'rgb(27, 27, 28)', color: 'rgb(240, 243, 245)' }}
                                 >Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={updateNotes}>Save Notes</Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentPageProblems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No problems found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                        }
                      }} 
                      className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                    />
                  </PaginationItem>
                  
                  {generatePaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        }
                      }}
                      className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              Showing {startIndex + 1}-{endIndex} of {sortedProblems.length} problems 
              (Page {currentPage} of {totalPages || 1})
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default LeetCodeCompanyProblems;
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, Trash2Icon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from "react-router";

interface ProblemNote {
  company: string;
  title: string;
  difficulty: string;
  notes: string;
}

const NotesTaken: React.FC = () => {
  const { company } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<ProblemNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<ProblemNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentNote, setCurrentNote] = useState("");
  const [currentProblem, setCurrentProblem] = useState<ProblemNote | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Load all notes from all companies
    const loadAllNotes = () => {
      const allNotes: ProblemNote[] = [];
      
      // Get all company keys from localStorage that end with "-problem-notes"
      const keys = Object.keys(localStorage).filter(key => key.endsWith("-problem-notes"));
      
      keys.forEach(key => {
        const companyName = key.replace("-problem-notes", "");
        const notesData = localStorage.getItem(key);
        
        if (notesData) {
          const notesMap = JSON.parse(notesData);
          
          // Get problem difficulty information
          // Removed unused variable 'solvedData'
          const problemData = localStorage.getItem(`${companyName}-problem-data`);
          let difficultyMap: Record<string, string> = {};
          
          if (problemData) {
            try {
              const problems = JSON.parse(problemData);
              difficultyMap = problems.reduce((acc: Record<string, string>, problem: any) => {
                acc[problem.Title] = problem.Difficulty;
                return acc;
              }, {});
            } catch (e) {
              console.error("Error parsing problem data", e);
            }
          }
          
          // Add notes with content to the list
          Object.entries(notesMap).forEach(([title, noteContent]) => {
            if (noteContent && typeof noteContent === 'string' && noteContent.trim() !== '') {
              allNotes.push({
                company: companyName,
                title,
                difficulty: difficultyMap[title] || "UNKNOWN",
                notes: noteContent as string
              });
            }
          });
        }
      });
      
      return allNotes;
    };
    
    // Get notes specific to this company if company param exists
    if (company) {
      const notesData = localStorage.getItem(`${company}-problem-notes`);
      const problemData = localStorage.getItem(`${company}-problem-data`);
      
      if (notesData) {
        const notesMap = JSON.parse(notesData);
        let difficultyMap: Record<string, string> = {};
        
        if (problemData) {
          try {
            const problems = JSON.parse(problemData);
            difficultyMap = problems.reduce((acc: Record<string, string>, problem: any) => {
              acc[problem.Title] = problem.Difficulty;
              return acc;
            }, {});
          } catch (e) {
            console.error("Error parsing problem data", e);
          }
        }
        
        const companyNotes: ProblemNote[] = [];
        Object.entries(notesMap).forEach(([title, noteContent]) => {
          if (noteContent && typeof noteContent === 'string' && noteContent.trim() !== '') {
            companyNotes.push({
              company: company,
              title,
              difficulty: difficultyMap[title] || "UNKNOWN",
              notes: noteContent as string
            });
          }
        });
        
        setNotes(companyNotes);
        setFilteredNotes(companyNotes);
      }
    } else {
      // No company specified, load all notes
      const allNotes = loadAllNotes();
      setNotes(allNotes);
      setFilteredNotes(allNotes);
    }
  }, [company]);

  useEffect(() => {
    // Filter notes based on search term
    if (searchTerm.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        note => 
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notes]);

  // Update note
  const updateNote = () => {
    if (!currentProblem) return;
    
    // Get existing notes
    const notesKey = `${currentProblem.company}-problem-notes`;
    const existingNotesJson = localStorage.getItem(notesKey) || "{}";
    const existingNotes = JSON.parse(existingNotesJson);
    
    // Update the note
    existingNotes[currentProblem.title] = currentNote;
    
    // Save back to localStorage
    localStorage.setItem(notesKey, JSON.stringify(existingNotes));
    
    // Update state
    const updatedNotes = notes.map(note => 
      (note.company === currentProblem.company && note.title === currentProblem.title)
        ? { ...note, notes: currentNote }
        : note
    );
    
    // If note was cleared, filter it out
    const finalNotes = currentNote.trim() === "" 
      ? updatedNotes.filter(note => !(note.company === currentProblem.company && note.title === currentProblem.title))
      : updatedNotes;
    
    setNotes(finalNotes);
  };

  // Delete note
  const deleteNote = () => {
    if (!currentProblem) return;

    // Get existing notes
    const notesKey = `${currentProblem.company}-problem-notes`;
    const existingNotesJson = localStorage.getItem(notesKey) || "{}";
    const existingNotes = JSON.parse(existingNotesJson);
    
    // Delete the note
    delete existingNotes[currentProblem.title];
    
    // Save back to localStorage
    localStorage.setItem(notesKey, JSON.stringify(existingNotes));
    
    // Update state by filtering out the deleted note
    const updatedNotes = notes.filter(note => 
      !(note.company === currentProblem.company && note.title === currentProblem.title)
    );
    
    setNotes(updatedNotes);
    setShowDeleteConfirm(false);
  };

  // Open note for editing
  const openNoteEditor = (problem: ProblemNote) => {
    setCurrentProblem(problem);
    setCurrentNote(problem.notes);
  };

  // Navigate to the problem in its company context
  const navigateToProblem = (companyName: string) => {
    navigate(`/${companyName}`);
  };

  // Render difficulty badge
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
      default:
        badgeClass = "bg-gray-500 hover:bg-gray-600";
    }

    return <Badge className={badgeClass}>{difficulty}</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{company ? `${company} Notes` : "All Problem Notes"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No notes found. Start adding notes to problems to see them here.
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {!company && <TableHead className="w-32">Company</TableHead>}
                  <TableHead className="w-24">Difficulty</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead className="w-96">Note Preview</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotes.map((problem, index) => (
                  <TableRow key={index}>
                    {!company && (
                      <TableCell 
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => navigateToProblem(problem.company)}
                      >
                        {problem.company}
                      </TableCell>
                    )}
                    <TableCell>{renderDifficultyBadge(problem.difficulty)}</TableCell>
                    <TableCell className="font-medium">{problem.title}</TableCell>
                    <TableCell className="truncate max-w-xs">
                      {problem.notes.length > 100
                        ? `${problem.notes.substring(0, 100)}...`
                        : problem.notes}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              
                              className="rounded-full h-8 w-8"
                              onClick={() => openNoteEditor(problem)}
                            >
                              <FileTextIcon className="h-5 w-5 text-blue-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Notes for {problem.title}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Textarea
                                placeholder="Edit your notes..."
                                value={currentNote}
                                onChange={(e) => setCurrentNote(e.target.value)}
                                className="min-h-[200px]"
                              />
                            </div>
                            <div className="flex justify-between">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                
                                onClick={() => setShowDeleteConfirm(true)}
                              >
                                <Trash2Icon className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                              <div className="flex gap-2">
                                <DialogClose asChild>
                                  <Button variant="outline" style={{ backgroundColor: 'rgb(27, 27, 28)', color: 'rgb(240, 243, 245)' }}>Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button onClick={updateNote}>Save Notes</Button>
                                </DialogClose>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                       
                          className="rounded-full h-8 w-8"
                          onClick={() => {
                            openNoteEditor(problem);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <Trash2Icon className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredNotes.length} of {notes.length} notes
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              style={{ backgroundColor: 'rgb(27, 27, 28)', color: 'rgb(240, 243, 245)' }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              style={{backgroundColor:"red"}}
              onClick={deleteNote}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NotesTaken;
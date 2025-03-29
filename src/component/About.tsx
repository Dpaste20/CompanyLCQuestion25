import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const definitions = [
  "A LeetCode warrior whose primary skill is copying solutions from Discuss and slightly changing variable names to feel original.",
  "Repeats code snippets from LeetCode discussions but still fails test case #312.",
  "Solves every problem using brute force first, then wonders why it's TLE.",
  "Knows every DSA trick in the book but still struggles to answer 'Tell me about yourself.'",
  "Writes a solution that works fine for n = 10, but crashes the system for n = 1000.",
  "Cries while solving DP problems but keeps coming back for more.",
  "Sees a solution on YouTube, types it out, and pretends to understand it.",
  "Writes an O(n³) solution, submits it, and prays for divine intervention.",
  
];

const About: React.FC = () => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const randomDefinition = definitions[Math.floor(Math.random() * definitions.length)];

  return (
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle className="relative">
          Hello there,{" "}
          <span 
            className="text-blue-600 dark:text-gray-300 hover:text-blue-400 transition-colors duration-200 cursor-pointer relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            LeetCode Monkey
            {showTooltip && (
              <div className="absolute z-10 bg-gray-800 text-white p-3 rounded-md shadow-lg max-w-xs left--4 bottom-full mb-4 text-sm"
                style={{ width: "400px" }}
              >
                {randomDefinition}
              </div>
            )}
          </span> 👋
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-gray-600 dark:text-gray-300">
          This application helps you practice LeetCode problems specific to companies and take notes effectively. Good luck with your placements!
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Want to contribute? Head over to{" "}
          <a
            href="https://github.com/Dpaste20/CompanyLCQuestion25"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub repository
          </a>.
        </p>
        <p>
          Contact{" "}
          <a
            href="mailto:dhruvppaste20@gmail.com"
            className="text-blue-500 hover:underline"
          >
            dhruvppaste20@gmail.com
          </a>
        </p>
      
        <Button
          onClick={() => navigate("/")}
          style={{ backgroundColor: "rgb(27, 27, 28)", color: "rgb(240, 243, 245)" }}
        >
          Back to Home
        </Button>
      </CardContent>
    </Card>
  );
};

export default About;
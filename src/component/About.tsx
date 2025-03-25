
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Hello there , LeetCode Monkey 👋</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-gray-600 dark:text-gray-300">
          This application helps you practice LeetCode problems specific to companies and take notes effectively. Good luck with your placements
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
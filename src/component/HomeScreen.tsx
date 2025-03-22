import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { FileTextIcon } from "lucide-react";

const companies = [
    "Accenture",
    "Accolite",
    "Adobe",
    "Affirm",
    "Agoda",
    "Airbnb",
    "Airtel",
    "Akamai",
    "AkunaCapital",
    "Alibaba",
    "Altimetrik",
    "Amazon",
    "AMD",
    "Amdocs",
    "AmericanExpress",
    "Anduril",
    "Apple",
    "Arcesium",
    "AristaNetworks",
    "athenahealth",
    "Atlassian",
    "Attentive",
    "Autodesk",
    "Avito",
    "Baidu",
    "Barclays",
    "BitGo",
    "BlackRock",
    "Blizzard",
    "Block",
    "Bloomberg",
    "BNYMellon",
    "Bolt",
    "Booking.com",
    "Box",
    "BP",
    "ByteDance",
    "Cadence",
    "Capgemini",
    "CapitalOne",
    "CARS24",
    "carwale",
    "Cashfree",
    "Chewy",
    "Cisco",
    "Citadel",
    "Citrix",
    "Cloudera",
    "Cloudflare",
    "Cognizant",
    "Coinbase",
    "Commvault",
    "Confluent",
    "ConsultAdd",
    "Coupang",
    "Coursera",
    "CrowdStrike",
    "Cruise",
    "CureFit",
    "Darwinbox",
    "Databricks",
    "Datadog",
    "DEShaw",
    "Deliveroo",
    "Dell",
    "Deloitte",
    "DeutscheBank",
    "DevRev",
    "Directi",
    "Disney",
    "Docusign",
    "DoorDash",
    "DPworld",
    "Dream11",
    "Dropbox",
    "DRW",
    "Dunzo",
    "eBay",
    "EPAMSystems",
    "EpicSystems",
    "Expedia",
    "FactSet",
    "Flexport",
    "Flipkart",
    "FreshWorks",
    "GEHealthcare",
    "Geico",
    "Gojek",
    "GoldmanSachs",
    "Google",
    "Grab",
    "Grammarly",
    "Graviton",
    "Groww",
    "GSNGames",
    "HashedIn",
    "HCL",
    "HPE",
    "Huawei",
    "Hubspot",
    "HudsonRiverTrading",
    "Hulu",
    "IBM",
    "IMC",
    "Indeed",
    "Infosys",
    "InMobi",
    "Instacart",
    "Intel",
    "Intuit",
    "IXL",
    "J.P.Morgan",
    "JaneStreet",
    "jio",
    "joshtechnology",
    "JumpTrading",
    "Juspay",
    "Karat",
    "KLA",
    "LinkedIn",
    "LiveRamp",
    "Lowe's",
    "Lucid",
    "Lyft",
    "MakeMyTrip",
    "Mastercard",
    "MathWorks",
    "Media.net",
    "Meesho",
    "Mercari",
    "Meta",
    "Microsoft",
    "Millennium",
    "Mitsogo",
    "Moloco",
    "MongoDB",
    "MorganStanley",
    "Moveworks",
    "Myntra",
    "Nagarro",
    "NetApp",
    "Netflix",
    "Nextdoor",
    "Niantic",
    "Nielsen",
    "Nike",
    "Nordstrom",
    "Nutanix",
    "Nvidia",
    "Okta",
    "OKX",
    "OpenAI",
    "opentext",
    "Oracle",
    "Otter.ai",
    "oyo",
    "Ozon",
    "PalantirTechnologies",
    "PaloAltoNetworks",
    "PayPal",
    "Paytm",
    "persistentsystems",
    "PhonePe",
    "Pinterest",
    "PocketGems",
    "Point72",
    "PornHub",
    "PureStorage",
    "Qualcomm",
    "Quora",
    "Rakuten",
    "razorpay",
    "RBC",
    "Reddit",
    "Revolut",
    "Ripple",
    "Rippling",
    "Robinhood",
    "Roblox",
    "Roku",
    "Rubrik",
    "Salesforce",
    "Samsara",
    "Samsung",
    "SAP",
    "ServiceNow",
    "Shopee",
    "Shopify",
    "Siemens",
    "SIG",
    "Sigmoid",
    "Snap",
    "Snowflake",
    "SoFi",
    "Splunk",
    "Spotify",
    "Sprinklr",
    "SquarepointCapital",
    "Stripe",
    "Swiggy",
    "tcs",
    "Tekion",
    "Tencent",
    "Tesla",
    "thoughtspot",
    "ThoughtWorks",
    "TikTok",
    "Tinkoff",
    "Trilogy",
    "Turing",
    "Turo",
    "Twilio",
    "Twitch",
    "TwoSigma",
    "Uber",
    "UiPath",
    "UKG",
    "VeevaSystems",
    "Verily",
    "Verkada",
    "VirtuFinancial",
    "Visa",
    "VK",
    "VMware",
    "WalmartLabs",
    "Warnermedia",
    "Wayfair",
    "WellsFargo",
    "Wipro",
    "Wix",
    "Workday",
    "X",
    "Yahoo",
    "Yandex",
    "Yelp",
    "Zalando",
    "Zenefits",
    "Zepto",
    "Zeta",
    "Zillow",
    "Zoho",
    "Zomato",
    "Zopsmart",
    "ZSAssociates",
    "ZScaler",
  ];

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const filteredCompanies = companies.filter((company) =>
    company.toLowerCase().includes(search.toLowerCase())
  );
  const navigate = useNavigate();
  
  return (
    <div className="p-6 w-full mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 text-center"
        />
        <div className="flex-1 flex justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate("/notes")}
          >
            <FileTextIcon className="h-4 w-4" />
            My Notes
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {filteredCompanies.map((company) => (
          <Card
            key={company}
            className="w-full aspect-square flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => navigate(`/${company}`)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div>{company}</div>
              <div className="mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/notes/${company}`);
                  }}
                >
                  <FileTextIcon className="h-3 w-3 mr-1" />
                  View Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
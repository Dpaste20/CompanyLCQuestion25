import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const companies = [
  "Accenture", "Accolite", "Adobe", "Affirm", "Agoda", "Airbnb", "Airtel",
  "Akamai", "Akuna Capital", "Alibaba", "Altimetrik", "Amazon", "AMD", "Amdocs",
  "American Express", "Anduril", "Apple", "Arcesium", "Arista Networks",
  "athenahealth", "Atlassian", "Attentive", "Autodesk", "Avito", "Baidu",
  "Barclays", "BitGo", "BlackRock", "Blizzard", "Block", "Bloomberg",
  "BNY Mellon", "Bolt", "Booking.com", "Box", "BP", "ByteDance", "Cadence",
  "Capgemini", "Capital One", "CARS24", "carwale", "Cashfree", "Chewy",
  "Cisco", "Citadel", "Citrix", "Cloudera", "Cloudflare", "Cognizant",
  "Coinbase", "Commvault", "Confluent", "ConsultAdd", "Coupang", "Coursera",
  "CrowdStrike", "Cruise", "CureFit", "Darwinbox", "Databricks", "Datadog",
  "DE Shaw", "Deliveroo", "Dell", "Deloitte", "Deutsche Bank", "DevRev",
  "Directi", "Disney", "Docusign", "DoorDash", "DP world", "Dream11",
  "Dropbox", "DRW", "Dunzo", "eBay", "EPAM Systems", "Epic Systems",
  "Expedia", "FactSet", "Flexport", "Flipkart", "FreshWorks", "GE Healthcare",
  "Geico", "Gojek", "Goldman Sachs", "Google", "Grab", "Grammarly", "Graviton",
  "Groww", "GSN Games", "HashedIn", "HCL", "HPE", "Huawei", "Hubspot",
  "Hudson River Trading", "Hulu", "IBM", "IMC", "Indeed", "Infosys", "InMobi",
  "Instacart", "Intel", "Intuit", "IXL", "J.P. Morgan", "Jane Street", "jio",
  "josh technology", "Jump Trading", "Juspay", "Karat", "KLA", "LinkedIn",
  "LiveRamp", "Lowe's", "Lucid", "Lyft", "MakeMyTrip", "Mastercard",
  "MathWorks", "Media.net", "Meesho", "Mercari", "Meta", "Microsoft",
  "Millennium", "Mitsogo", "Moloco", "MongoDB", "Morgan Stanley", "Moveworks",
  "Myntra", "Nagarro", "NetApp", "Netflix", "Nextdoor", "Niantic", "Nielsen",
  "Nike", "Nordstrom", "Nutanix", "Nvidia", "Okta", "OKX", "OpenAI", "opentext",
  "Oracle", "Otter.ai", "oyo", "Ozon", "Palantir Technologies",
  "Palo Alto Networks", "PayPal", "Paytm", "persistent systems", "PhonePe",
  "Pinterest", "Pocket Gems", "Point72", "PornHub", "Pure Storage", "Qualcomm",
  "Quora", "Rakuten", "razorpay", "RBC", "Reddit", "Revolut", "Ripple",
  "Rippling", "Robinhood", "Roblox", "Roku", "Rubrik", "Salesforce", "Samsara",
  "Samsung", "SAP", "ServiceNow", "Shopee", "Shopify", "Siemens", "SIG",
  "Sigmoid", "Snap", "Snowflake", "SoFi", "Splunk", "Spotify", "Sprinklr",
  "Squarepoint Capital", "Stripe", "Swiggy", "tcs", "Tekion", "Tencent",
  "Tesla", "thoughtspot", "ThoughtWorks", "TikTok", "Tinkoff", "Trilogy",
  "Turing", "Turo", "Twilio", "Twitch", "Two Sigma", "Uber", "UiPath", "UKG",
  "Veeva Systems", "Verily", "Verkada", "Virtu Financial", "Visa", "VK",
  "VMware", "Walmart Labs", "Warnermedia", "Wayfair", "Wells Fargo", "Wipro",
  "Wix", "Workday", "X", "Yahoo", "Yandex", "Yelp", "Zalando", "Zenefits",
  "Zepto", "Zeta", "Zillow", "Zoho", "Zomato", "Zopsmart", "ZS Associates",
  "ZScaler"
];

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full mx-auto flex flex-col items-center">
      <Input
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-1/2 text-center"
      />
      <div className="grid grid-cols-3 gap-4 w-full">
        {filteredCompanies.map((company) => (
          <Card key={company} className="w-full aspect-square flex items-center justify-center text-center">
            <CardContent className="p-4">{company}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

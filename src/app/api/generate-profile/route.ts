import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PROMPT = `Generate a realistic O-1 visa case strategy JSON for a fictional applicant. The JSON must follow this exact structure and schema for chosen criteria. Choose between 3 and 8 criteria at random, and between 1 and 20 instances per chosen critera. Only the values should vary (names, titles, descriptions, instance counts, etc.). All field values should be empty strings or empty arrays as shown — do not populate them with data.

Return ONLY valid JSON, no markdown, no explanation, no preamble.

{
  "applicant_name": "<Full name>",
  "profile_type": "<a-short-slug-like-this>",
  "demographic_information": {
    "fields": [
      { "name": "legal_name", "label": "Legal Name", "type": "text", "required": true, "value": "" },
      { "name": "passport", "label": "Passport", "type": "file", "required": true, "hint": "Upload a clear copy of your passport bio page", "value": "" },
      { "name": "country_of_birth", "label": "Country of Birth", "type": "text", "required": true, "value": "" },
      { "name": "current_visa", "label": "Current Visa Status", "type": "text", "required": true, "hint": "e.g., F-1, H-1B, or None", "value": "" },
      { "name": "address", "label": "Current Address", "type": "text", "required": true, "hint": "Include both U.S. and foreign address if applicable", "value": "" }
    ]
  },
  "criteria": [
    {
      "id": "scholarly-articles",
      "name": "Scholarly Articles",
      "description": "<relevant description for this applicant>",
      "guidance": "<specific guidance relevant to this applicant's field>",
      "instances": [
        {
          "id": "sa-1",
          "title": "<realistic instance title>",
          "fields": [
            { "name": "publication_title", "label": "Article Title", "type": "text", "required": true, "value": "" },
            { "name": "journal_name", "label": "Conference/Journal Name", "type": "text", "required": true, "value": "" },
            { "name": "publication_date", "label": "Publication Date", "type": "date", "required": true, "value": "" },
            { "name": "author_role", "label": "Your Role", "type": "text", "required": true, "hint": "First author, corresponding author, co-author, etc.", "value": "" },
            { "name": "citation_count", "label": "Citation Count", "type": "text", "required": false, "hint": "Number of times cited (if available)", "value": "" },
            { "name": "publication_proof", "label": "Publication Evidence", "type": "files_or_urls", "required": true, "hint": "PDF of paper, conference proceedings link, or arXiv link", "value": [] }
          ]
        }
      ]
    },
    {
      "id": "judging",
      "name": "Judging",
      "description": "<relevant description>",
      "guidance": "<specific guidance>",
      "instances": [
        {
          "id": "j-1",
          "title": "<realistic instance title>",
          "fields": [
            { "name": "organization_name", "label": "Conference/Journal Name", "type": "text", "required": true, "value": "" },
            { "name": "role_description", "label": "Your Role", "type": "text", "required": true, "hint": "Peer reviewer, area chair, senior program committee, etc.", "value": "" },
            { "name": "date_range", "label": "Time Period", "type": "text", "required": true, "hint": "e.g., 2022 - Present", "value": "" },
            { "name": "number_reviewed", "label": "Number of Submissions Reviewed", "type": "text", "required": false, "hint": "Approximate number if known", "value": "" },
            { "name": "proof", "label": "Proof of Service", "type": "files_or_urls", "required": true, "hint": "Invitation letters, certificates, acknowledgment from conference", "value": [] }
          ]
        }
      ]
    },
    {
      "id": "original-contributions",
      "name": "Original Contributions",
      "description": "<relevant description>",
      "guidance": "<specific guidance>",
      "instances": [
        {
          "id": "oc-1",
          "title": "<realistic instance title>",
          "fields": [
            { "name": "work_description", "label": "Describe Your Work", "type": "text", "required": true, "hint": "What did you create or contribute that was original and innovative?", "value": "" },
            { "name": "impact_description", "label": "Impact on the Field", "type": "text", "required": true, "hint": "How has your work influenced the industry or community? Include metrics if possible.", "value": "" },
            { "name": "supporting_evidence", "label": "Supporting Evidence", "type": "files_or_urls", "required": true, "hint": "GitHub repositories, technical blog posts, conference talks, citations, adoption metrics", "value": [] }
          ]
        }
      ]
    },
    {
      "id": "awards",
      "name": "Awards",
      "description": "<relevant description>",
      "guidance": "<specific guidance>",
      "instances": [
        {
          "id": "a-1",
          "title": "<realistic instance title>",
          "fields": [
            { "name": "award_name", "label": "Award Name", "type": "text", "required": true, "value": "" },
            { "name": "issuing_organization", "label": "Issuing Organization", "type": "text", "required": true, "value": "" },
            { "name": "date_received", "label": "Date Received", "type": "date", "required": true, "value": "" },
            { "name": "selection_criteria", "label": "Selection Criteria", "type": "text", "required": true, "hint": "Describe what the award recognizes and how selective it is", "value": "" },
            { "name": "proof", "label": "Award Documentation", "type": "files_or_urls", "required": true, "hint": "Certificate, announcement, award letter", "value": [] }
          ]
        }
      ]
    },
    {
      "id": "press",
      "name": "Press",
      "description": "<relevant description>",
      "guidance": "<specific guidance>",
      "instances": [
        {
          "id": "p-1",
          "title": "<realistic instance title>",
          "fields": [
            { "name": "publication_name", "label": "Publication Name", "type": "text", "required": true, "value": "" },
            { "name": "article_title", "label": "Article Title", "type": "text", "required": true, "value": "" },
            { "name": "publication_date", "label": "Publication Date", "type": "date", "required": true, "value": "" },
            { "name": "article_link", "label": "Article Link/PDF", "type": "files_or_urls", "required": true, "hint": "Link to article or PDF copy", "value": [] }
          ]
        }
      ]
    },
    {
      "id": "membership",
      "name": "Membership",
      "description": "<relevant description>",
      "guidance": "<specific guidance>",
      "instances": [
        {
          "id": "m-1",
          "title": "<realistic instance title>",
          "fields": [
            { "name": "date_selected", "label": "Date Selected/Admitted", "type": "date", "required": true, "value": "" },
            { "name": "proof_of_membership", "label": "Proof of Membership", "type": "files_or_urls", "required": true, "hint": "Acceptance letter, certificate, or official documentation", "value": [] }
          ]
        }
      ]
    },
    {
      "id": "critical-role",
      "name": "Critical Role",
      "description": "<relevant description>",
      "guidance": "<specific guidance>",
      "instances": [
        {
          "id": "cr-1",
          "title": "<realistic instance title>",
          "fields": [
            { "name": "start_date", "label": "Start Date", "type": "date", "required": true, "value": "" },
            { "name": "end_date", "label": "End Date", "type": "date", "required": false, "hint": "Leave blank if current position", "value": "" },
            { "name": "key_responsibilities", "label": "Key Responsibilities", "type": "text", "required": true, "hint": "Describe your role, team size, and impact on the organization", "value": "" },
            { "name": "examples", "label": "Supporting Evidence", "type": "files_or_urls", "required": true, "hint": "Offer letter, organizational charts, project documentation, internal announcements", "value": [] }
          ]
        }
      ]
    },
    {
      "id": "high-remuneration",
      "name": "High Remuneration",
      "description": "<relevant description>",
      "guidance": "<specific guidance>",
      "instances": [
        {
          "id": "hr-1",
          "title": "<realistic instance title>",
          "fields": [
            { "name": "work_location", "label": "Work Location", "type": "text", "required": true, "hint": "City and State/Country", "value": "" },
            { "name": "salary", "label": "Annual Salary", "type": "text", "required": true, "hint": "Include currency and any bonuses/equity (e.g., $450,000 USD + equity)", "value": "" },
            { "name": "paystubs", "label": "Recent Paystubs", "type": "files", "required": true, "hint": "Upload your last 4 paystubs", "value": [] },
            { "name": "comparison_data", "label": "Industry Comparison", "type": "files_or_urls", "required": false, "hint": "Salary surveys or data showing you're in top percentile", "value": [] }
          ]
        }
      ]
    }
  ]
}

Generate a unique applicant in a different professional field each time, with a random but sensible name. Vary the criteria chosen and choose between 3-8. Vary the number of instances per criterion (between 1-20). Make instance titles realistic and specific to the applicant's field. Keep descriptions and guidance relevant to the applicant's profession.

The name "Dr. Anya Sharma" is generated a lot. Please be creative with the name and make sure its different every time.
`;

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(PROMPT);
    const text = result.response.text();

    // Strip markdown fences if present
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    parsed.profile_type = parsed.profile_type + '-' + Date.now();

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to generate profile:', error);
    return NextResponse.json({ error: 'Failed to generate profile' }, { status: 500 });
  }
}

import { mockCases, mockDocuments } from './assistant-data';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export async function processQuery(query: string, history: ChatMessage[]): Promise<string> {
  const lowerQuery = query.toLowerCase();

  // 1. Check for Pending/Open Cases
  if (lowerQuery.includes("pending") || lowerQuery.includes("open") || (lowerQuery.includes("status") && lowerQuery.includes("cases"))) {
    const pendingCases = mockCases.filter(c => c.status === "Pending" || c.status === "Open");
    if (pendingCases.length === 0) return "You currently have no pending or open cases.";
    
    let response = `You have **${pendingCases.length}** pending/open cases:\n\n`;
    pendingCases.forEach(c => {
      response += `- **${c.title}** (${c.id})\n  Status: ${c.status}\n`;
    });
    return response;
  }

  // 2. Check for Upcoming Hearings
  if (lowerQuery.includes("hearing") || lowerQuery.includes("upcoming") || lowerQuery.includes("next date")) {
    const casesWithHearings = mockCases.filter(c => c.nextHearing);
    if (casesWithHearings.length === 0) return "You have no upcoming hearings scheduled.";
    
    let response = `Here are your upcoming hearings:\n\n`;
    casesWithHearings.forEach(c => {
      const dateStr = new Date(c.nextHearing!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
      response += `- **${c.title}**\n  Date: ${dateStr}\n`;
    });
    return response;
  }

  // 3. Check for Closed Cases
  if (lowerQuery.includes("closed") || lowerQuery.includes("past cases")) {
    const closedCases = mockCases.filter(c => c.status === "Closed");
    if (closedCases.length === 0) return "You don't have any closed cases.";
    
    let response = `Here are your closed cases:\n\n`;
    closedCases.forEach(c => {
      response += `- **${c.title}** (${c.id})\n`;
    });
    return response;
  }

  // 4. Check for Recent Documents
  if (lowerQuery.includes("document") || lowerQuery.includes("recent docs") || lowerQuery.includes("file")) {
    if (mockDocuments.length === 0) return "No recent documents found.";
    
    let response = `Here are your recent documents:\n\n`;
    mockDocuments.forEach(doc => {
      const dateStr = new Date(doc.dateUploaded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      response += `- **${doc.name}**\n  Uploaded: ${dateStr}\n`;
    });
    return response;
  }

  // 5. Smart Insights (Automated Context)
  if (lowerQuery.includes("insight") || lowerQuery.includes("summary") || lowerQuery.includes("activity")) {
    const noUpdatesForAWhile = mockCases.filter(c => {
        const diffTime = Math.abs(Date.now() - new Date(c.lastActivity).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays > 10 && c.status !== "Closed";
    });

    const casesWithHearings = mockCases.filter(c => c.nextHearing);

    let response = "Here are some quick insights:\n\n";
    if (casesWithHearings.length > 0) {
      response += `- You have **${casesWithHearings.length} upcoming hearings**.\n`;
    }
    if (noUpdatesForAWhile.length > 0) {
      response += `- The case **${noUpdatesForAWhile[0].title}** has had no updates recently.\n`;
    }
    
    if (response === "Here are some quick insights:\n\n") {
       response += "Everything looks up to date!";
    }

    return response;
  }

  // Context awareness fallback (super basic)
  if (lowerQuery.includes("show details") || lowerQuery.includes("more info")) {
    if (history.length > 0) {
      const lastBotMsg = [...history].reverse().find(m => m.role === 'assistant');
      if (lastBotMsg && (lastBotMsg.content.includes("TechCorp") || lastBotMsg.content.includes("Pending"))) {
         return "The case **Smith vs. TechCorp (NDA Breach)** involves a potential breach of confidentiality. The next hearing requires the submission of primary evidence documents. Do you want to view the files?";
      }
    }
    return "Could you specify which case or document you want details for?";
  }

  // Default Fallback
  return "I'm not entirely sure how to help with that yet. Try asking about your **pending cases**, **upcoming hearings**, or **recent documents**.";
}

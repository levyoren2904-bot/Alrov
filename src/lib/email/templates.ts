export function applicationConfirmationEmail(candidateName: string, jobTitle: string): { subject: string; body: string } {
  return {
    subject: `קיבלנו את מועמדותך למשרת ${jobTitle}`,
    body: `שלום ${candidateName},

תודה שהגשת מועמדות למשרת ${jobTitle} בקבוצת מלונות אלרוב.

קיבלנו את פנייתך ונחזור אליך בהקדם האפשרי.

בברכה,
צוות משאבי אנוש
קבוצת מלונות אלרוב`,
  };
}

export function recruiterNotificationEmail(
  candidateName: string,
  candidateEmail: string,
  jobTitle: string,
  hotelName: string
): { subject: string; body: string } {
  return {
    subject: `מועמדות חדשה: ${candidateName} - ${jobTitle}`,
    body: `התקבלה מועמדות חדשה:

שם: ${candidateName}
אימייל: ${candidateEmail}
משרה: ${jobTitle}
מלון: ${hotelName}

נא לבדוק את המועמדות במערכת הניהול.

צוות מלונות אלרוב`,
  };
}

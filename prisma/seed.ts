import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clear existing data
  await prisma.applicationEvent.deleteMany();
  await prisma.applicationNote.deleteMany();
  await prisma.emailDelivery.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.hotel.deleteMany();

  // Create Hotels
  const hotel1 = await prisma.hotel.create({
    data: {
      name: 'מלון ממילא ירושלים',
      slug: 'mamilla-jerusalem',
      city: 'ירושלים',
      imageUrl: '',
    },
  });

  const hotel2 = await prisma.hotel.create({
    data: {
      name: 'מלון דוד סיטדל ירושלים',
      slug: 'david-citadel-jerusalem',
      city: 'ירושלים',
      imageUrl: '',
    },
  });

  console.log('🏨 Created 2 hotels');

  // Create Departments
  const deptNames = [
    { name: 'מזון ומשקאות', slug: 'food-and-beverage' },
    { name: 'קבלה', slug: 'front-desk' },
    { name: 'משאבי אנוש', slug: 'human-resources' },
    { name: 'ניהול', slug: 'management' },
    { name: 'תחזוקה', slug: 'maintenance' },
  ];

  const departments = await Promise.all(
    deptNames.map((dept) =>
      prisma.department.create({ data: dept })
    )
  );
  console.log('🏢 Created 5 departments');

  // Create Users
  const password = await bcrypt.hash('Alrov2024!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@alrov.co.il',
      passwordHash: password,
      name: 'דני כהן',
      role: 'ADMIN',
    },
  });

  const hrManager = await prisma.user.create({
    data: {
      email: 'hr@alrov.co.il',
      passwordHash: password,
      name: 'שרה לוי',
      role: 'HR_MANAGER',
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      email: 'recruiter@alrov.co.il',
      passwordHash: password,
      name: 'יעל אברהם',
      role: 'RECRUITER',
    },
  });

  console.log('👤 Created 3 users');
  console.log('──────────────────────────────────────');
  console.log('   Admin:     admin@alrov.co.il     / Alrov2024!');
  console.log('   HR:        hr@alrov.co.il        / Alrov2024!');
  console.log('   Recruiter: recruiter@alrov.co.il / Alrov2024!');
  console.log('──────────────────────────────────────');

  // Create Jobs
  const jobsData = [
    {
      title: 'מנהל/ת מסעדה',
      slug: 'restaurant-manager-mamilla',
      hotel: hotel1,
      department: departments[0],
      employmentType: 'FULL_TIME' as const,
      city: 'ירושלים',
      description: 'אנו מחפשים מנהל/ת מסעדה מנוסה שיוביל/תוביל את המסעדה הראשית במלון ממילא. התפקיד כולל ניהול צוות, תכנון תפריטים ושירות לקוחות ברמה הגבוהה ביותר.',
      responsibilities: '• ניהול צוות המסעדה (30+ עובדים)\n• תכנון וניהול תפריטים עונתיים\n• שמירה על רמת שירות גבוהה\n• ניהול תקציב ועלויות מזון\n• קיום אירועים מיוחדים',
      requirements: '• ניסיון של 5+ שנים בניהול מסעדה\n• ניסיון במלונאות יוקרה - יתרון\n• יכולות מנהיגות מוכחות\n• אנגלית ברמה גבוהה\n• זמינות למשמרות ערב וסופי שבוע',
      benefits: '• שכר תחרותי\n• ארוחות במלון\n• ביטוח בריאות מורחב\n• הנחות עובדים ברשת המלונות\n• הכשרות מקצועיות',
      recruiterId: recruiter.id,
      recipientEmails: ['hr@alrov.co.il'],
      screeningQuestions: [
        { question: 'כמה שנות ניסיון יש לך בניהול מסעדה?', required: true, type: 'text' },
        { question: 'האם יש לך ניסיון במלונאות יוקרה?', required: false, type: 'text' },
      ],
    },
    {
      title: 'פקיד/ת קבלה בכיר/ה',
      slug: 'senior-receptionist-citadel',
      hotel: hotel2,
      department: departments[1],
      employmentType: 'FULL_TIME' as const,
      city: 'ירושלים',
      description: 'מלון דוד סיטדל מגייס פקיד/ת קבלה בכיר/ה לצוות הקבלה. התפקיד מציע סביבה מקצועית ברמה הגבוהה ביותר, עם דגש על שירות אישי ומעולה לאורחים מכל העולם.',
      responsibilities: '• קבלת אורחים וביצוע check-in/check-out\n• מענה לפניות ובקשות מיוחדות\n• תיאום עם מחלקות המלון\n• ניהול הזמנות ושינויים\n• טיפול בתלונות',
      requirements: '• ניסיון של 3+ שנים בקבלה במלון\n• אנגלית שוטפת\n• שפה נוספת - יתרון\n• יחסי אנוש מצוינים\n• יכולת עבודה במשמרות',
      benefits: '• שכר בסיס + טיפים\n• ארוחות\n• ביטוח בריאות\n• הנחות ברשת',
      recruiterId: recruiter.id,
      recipientEmails: ['hr@alrov.co.il'],
      screeningQuestions: [
        { question: 'אילו שפות את/ה דובר/ת?', required: true, type: 'text' },
      ],
    },
    {
      title: 'מנהל/ת משאבי אנוש',
      slug: 'hr-manager-alrov',
      hotel: hotel1,
      department: departments[2],
      employmentType: 'FULL_TIME' as const,
      city: 'ירושלים',
      description: 'דרוש/ה מנהל/ת משאבי אנוש לקבוצת מלונות אלרוב. התפקיד כולל ניהול מלא של תהליכי HR כולל גיוס, הדרכה, שכר ותנאים ופיתוח ארגוני.',
      responsibilities: '• ניהול תהליכי גיוס ומיון\n• פיתוח תוכניות הדרכה\n• ניהול מערך שכר ותנאים\n• ייעוץ למנהלים\n• טיפול בנושאי משמעת ורווחה',
      requirements: '• תואר ראשון במשאבי אנוש / ניהול\n• 5+ שנות ניסיון ב-HR\n• הכרות עם דיני עבודה\n• ניסיון במלונאות - יתרון משמעותי\n• יכולת ניהול צוות',
      benefits: '• שכר תחרותי + בונוסים\n• רכב צמוד\n• ביטוח מנהלים\n• הנחות עובדים',
      recruiterId: hrManager.id,
      recipientEmails: ['admin@alrov.co.il'],
      screeningQuestions: [],
    },
    {
      title: 'שף דה פרטי',
      slug: 'chef-de-partie-mamilla',
      hotel: hotel1,
      department: departments[0],
      employmentType: 'FULL_TIME' as const,
      city: 'ירושלים',
      description: 'מלון ממילא מחפש שף דה פרטי מוכשר/ת שיצטרף/תצטרף למטבח שלנו. הזדמנות להוביל תחנה במטבח יוקרתי ולעבוד לצד שף ראשי מוערך.',
      responsibilities: '• הובלת תחנה במטבח\n• הכנת מנות ברמה גבוהה\n• פיקוח על טריות ואיכות\n• ניהול מלאי התחנה\n• הדרכת טבחים זוטרים',
      requirements: '• 3+ שנות ניסיון כשף\n• הכשרה קולינרית מוכרת\n• יצירתיות ותשוקה לבישול\n• יכולת עבודה בלחץ\n• ניסיון במטבח ים תיכוני - יתרון',
      benefits: '• שכר תחרותי\n• ארוחות\n• מדים\n• הכשרות מקצועיות',
      recruiterId: recruiter.id,
      recipientEmails: ['hr@alrov.co.il'],
      screeningQuestions: [
        { question: 'מה ההתמחות הקולינרית שלך?', required: true, type: 'text' },
      ],
    },
    {
      title: 'טכנאי/ת תחזוקה',
      slug: 'maintenance-technician-citadel',
      hotel: hotel2,
      department: departments[4],
      employmentType: 'FULL_TIME' as const,
      city: 'ירושלים',
      description: 'דרוש/ה טכנאי/ת תחזוקה מנוסה למלון דוד סיטדל. התפקיד כולל תחזוקה שוטפת ומניעתית של מערכות המלון.',
      responsibilities: '• תחזוקה שוטפת של חדרים ושטחים ציבוריים\n• טיפול בתקלות חשמל ואינסטלציה\n• תחזוקה מניעתית\n• תיאום עם קבלנים חיצוניים\n• דיווח וייתוד תקלות',
      requirements: '• ניסיון של 3+ שנים בתחזוקה\n• ידע בחשמל ואינסטלציה\n• רישיון חשמלאי - יתרון\n• זמינות למשמרות\n• יחסי אנוש טובים',
      benefits: '• שכר תחרותי\n• ארוחות\n• ביטוח בריאות',
      recruiterId: null,
      recipientEmails: ['hr@alrov.co.il'],
      screeningQuestions: [],
    },
    {
      title: 'מנהל/ת אירועים',
      slug: 'events-manager-mamilla',
      hotel: hotel1,
      department: departments[3],
      employmentType: 'FULL_TIME' as const,
      city: 'ירושלים',
      description: 'מלון ממילא מגייס מנהל/ת אירועים מנוסה. נדרש/ת אדם יצירתי עם כישורי ניהול מעולים ויכולת לנהל אירועים מהגדולים ביותר.',
      responsibilities: '• ניהול אירועים מא׳ ועד ת׳\n• מכירת אירועים ומשא ומתן\n• תיאום עם ספקים ולקוחות\n• ניהול תקציבי אירועים\n• פיקוח על הביצוע ביום האירוע',
      requirements: '• 4+ שנות ניסיון בניהול אירועים\n• ניסיון במלונאות - חובה\n• יכולות מכירה מצוינות\n• אנגלית ברמה גבוהה\n• גמישות בשעות עבודה',
      benefits: '• שכר + עמלות\n• ביטוח מנהלים\n• הנחות ברשת המלונות',
      recruiterId: hrManager.id,
      recipientEmails: ['hr@alrov.co.il'],
      screeningQuestions: [],
    },
    {
      title: 'ברמן/ית',
      slug: 'bartender-citadel',
      hotel: hotel2,
      department: departments[0],
      employmentType: 'PART_TIME' as const,
      city: 'ירושלים',
      description: 'מלון דוד סיטדל מחפש ברמן/ית מקצועי/ת לבר הלובי. סביבה יוקרתית עם קוקטיילים ייחודיים ושירות ברמה הגבוהה ביותר.',
      responsibilities: '• הכנת קוקטיילים ומשקאות\n• שירות אורחים בבר\n• ניהול מלאי משקאות\n• שמירה על ניקיון וסדר\n• יצירתיות בתפריט משקאות',
      requirements: '• ניסיון של 2+ שנים כברמן/ית\n• קורס ברמנות מוכר\n• אנגלית בסיסית\n• יחסי אנוש מצוינים\n• זמינות לערבים וסופי שבוע',
      benefits: '• שכר + טיפים\n• ארוחות במשמרת',
      recruiterId: recruiter.id,
      recipientEmails: ['hr@alrov.co.il'],
      screeningQuestions: [],
    },
    {
      title: 'מנהל/ת חדרים',
      slug: 'rooms-division-manager',
      hotel: hotel1,
      department: departments[3],
      employmentType: 'FULL_TIME' as const,
      city: 'ירושלים',
      description: 'דרוש/ה מנהל/ת חטיבת חדרים מנוסה למלון ממילא. ניהול מלא של פעילות החדרים, הקבלה, משק הבית והקונסיירז\׳.',
      responsibilities: '• ניהול מחלקות הקבלה, משק בית וקונסיירז\׳\n• אחריות על שביעות רצון אורחים\n• ניהול תקציב חטיבת החדרים\n• פיקוח על RevPAR ו-ADR\n• הובלת צוות של 50+ עובדים',
      requirements: '• 7+ שנות ניסיון בתפקידי ניהול במלונאות\n• תואר אקדמי רלוונטי\n• אנגלית שוטפת\n• ניסיון עם Opera PMS\n• יכולות אנליטיות',
      benefits: '• שכר בכיר\n• רכב צמוד\n• בונוסים\n• הטבות מלון',
      recruiterId: hrManager.id,
      recipientEmails: ['hr@alrov.co.il', 'admin@alrov.co.il'],
      screeningQuestions: [
        { question: 'כמה שנות ניסיון ניהולי יש לך במלונאות?', required: true, type: 'text' },
        { question: 'האם יש לך ניסיון עם Opera PMS?', required: true, type: 'text' },
      ],
    },
    {
      title: 'סוכן/ת הזמנות',
      slug: 'reservations-agent',
      hotel: hotel2,
      department: departments[1],
      employmentType: 'FULL_TIME' as const,
      city: 'ירושלים',
      description: 'דרוש/ה סוכן/ת הזמנות לצוות ההזמנות המרכזי של מלון דוד סיטדל. התפקיד כולל טיפול בהזמנות, שירות לקוחות טלפוני ומקסום הכנסות.',
      responsibilities: '• קבלת ועיבוד הזמנות\n• מענה טלפוני מקצועי\n• upselling ומקסום הכנסות\n• עדכון מערכות הזמנות\n• טיפול בביטולים ושינויים',
      requirements: '• ניסיון בשירות לקוחות\n• אנגלית טובה\n• יכולת עבודה עם מערכות מחשב\n• יכולות מכירה\n• עבודה בצוות',
      benefits: '• שכר + בונוסי מכירות\n• ארוחות\n• ביטוח בריאות',
      recruiterId: recruiter.id,
      recipientEmails: ['hr@alrov.co.il'],
      screeningQuestions: [],
    },
    {
      title: 'מתמחה במשאבי אנוש',
      slug: 'hr-intern',
      hotel: hotel1,
      department: departments[2],
      employmentType: 'INTERNSHIP' as const,
      city: 'ירושלים',
      description: 'קבוצת אלרוב מציעה התמחות ייחודית במחלקת משאבי אנוש. הזדמנות ללמוד את עולם ה-HR במלונאות יוקרה מהמומחים הטובים ביותר.',
      responsibilities: '• סיוע בתהליכי גיוס\n• ניהול תיקי עובדים\n• השתתפות בפרויקטים ארגוניים\n• סיוע בהדרכות\n• עבודה מנהלית שוטפת',
      requirements: '• סטודנט/ית לתואר ראשון בתחום רלוונטי\n• יכולת ארגון\n• יחסי אנוש טובים\n• שליטה ב-Office\n• 3 ימים בשבוע לפחות',
      benefits: '• שכר מינימום\n• ארוחות\n• ניסיון יקר ערך\n• אפשרות לקליטה',
      recruiterId: hrManager.id,
      recipientEmails: ['hr@alrov.co.il'],
      screeningQuestions: [
        { question: 'מהו התואר שאת/ה לומד/ת?', required: true, type: 'text' },
        { question: 'כמה ימים בשבוע את/ה זמין/ה?', required: true, type: 'text' },
      ],
    },
  ];

  const jobs = [];
  for (const jobData of jobsData) {
    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        slug: jobData.slug,
        hotelId: jobData.hotel.id,
        departmentId: jobData.department.id,
        employmentType: jobData.employmentType,
        city: jobData.city,
        description: jobData.description,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements,
        benefits: jobData.benefits,
        screeningQuestions: jobData.screeningQuestions,
        recipientEmails: jobData.recipientEmails,
        recruiterId: jobData.recruiterId,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
    jobs.push(job);
  }
  console.log('💼 Created 10 jobs');

  // Create Applications
  const candidateNames = [
    'אורן לוי', 'נועה כהן', 'יוסי אברהם', 'מירב דוד', 'אייל שמואלי',
    'רונית בן ארי', 'עמית גולן', 'דנה פריד', 'תומר חן', 'שירה עזרא',
    'משה ברגר', 'ליאור אפרתי', 'הדר מלכה', 'איתן קדוש', 'עדי רוזנברג',
  ];

  const statuses: Array<'NEW' | 'IN_REVIEW' | 'PHONE_SCREEN' | 'INTERVIEW_SCHEDULED' | 'INTERVIEWED' | 'OFFER_SENT' | 'HIRED' | 'REJECTED'> = [
    'NEW', 'NEW', 'IN_REVIEW', 'IN_REVIEW', 'PHONE_SCREEN',
    'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFER_SENT', 'HIRED', 'REJECTED',
    'NEW', 'IN_REVIEW', 'PHONE_SCREEN', 'INTERVIEWED', 'REJECTED',
  ];

  for (let i = 0; i < 15; i++) {
    const jobIndex = i % jobs.length;
    const app = await prisma.application.create({
      data: {
        jobId: jobs[jobIndex].id,
        fullName: candidateNames[i],
        email: `candidate${i + 1}@example.com`,
        phone: `050-${String(1000000 + i).padStart(7, '0')}`,
        city: i % 2 === 0 ? 'ירושלים' : 'תל אביב',
        linkedinUrl: i % 3 === 0 ? `https://linkedin.com/in/candidate${i + 1}` : '',
        cvPath: `cv/sample-cv-${i + 1}.pdf`,
        cvOriginalName: `קורות-חיים-${candidateNames[i]}.pdf`,
        screeningAnswers: [],
        privacyConsent: true,
        status: statuses[i],
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.applicationEvent.create({
      data: {
        applicationId: app.id,
        type: 'APPLICATION_SUBMITTED',
        metadata: { source: 'web' },
        createdAt: app.createdAt,
      },
    });

    if (statuses[i] !== 'NEW') {
      await prisma.applicationEvent.create({
        data: {
          applicationId: app.id,
          userId: hrManager.id,
          type: 'STATUS_CHANGED',
          metadata: { newStatus: statuses[i] },
          createdAt: new Date(app.createdAt.getTime() + 24 * 60 * 60 * 1000),
        },
      });
    }

    if (i % 4 === 0) {
      await prisma.applicationNote.create({
        data: {
          applicationId: app.id,
          userId: hrManager.id,
          content: 'מועמד/ת מעניין/ת, יש להתקדם לשלב הבא.',
          createdAt: new Date(app.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }
  console.log('📋 Created 15 applications with events and notes');

  console.log('\n✅ Seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

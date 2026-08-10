import { Customer, MembershipTier, Gender, PhotoCategory } from '../types/customer';

const FIRST_NAMES_FEMALE = [
  'Ananya', 'Pooja', 'Kavya', 'Ritu', 'Sonal', 'Neha', 'Deepika', 'Aarti', 'Meera', 'Sneha',
  'Priya', 'Tanvi', 'Isha', 'Ayesha', 'Shruti', 'Divya', 'Anushka', 'Simran', 'Rhea', 'Kriti',
  'Trisha', 'Kiara', 'Radhika', 'Vidya', 'Payal', 'Bhavna', 'Shweta', 'Juhi', 'Aditi', 'Alia',
  'Tara', 'Janvi', 'Komal', 'Swati', 'Preeti', 'Kiran', 'Sheetal', 'Monika', 'Sunita', 'Pallavi',
  'Nisha', 'Sonam', 'Rashmi', 'Nidhi', 'Garima', 'Esha', 'Sayali', 'Richa', 'Mansi', 'Nikita'
];

const FIRST_NAMES_MALE = [
  'Vikram', 'Rohan', 'Aarav', 'Karan', 'Rahul', 'Siddharth', 'Varun', 'Amit', 'Rajesh', 'Sanjay',
  'Kabir', 'Aditya', 'Dev', 'Manish', 'Gaurav', 'Nikhil', 'Harsh', 'Yash', 'Arjun', 'Pranav',
  'Kunal', 'Abhishek', 'Vivek', 'Deepak', 'Suresh', 'Tarun', 'Anand', 'Ashish', 'Sameer', 'Pankaj',
  'Ketan', 'Rishabh', 'Vikas', 'Gautam', 'Saurabh', 'Mayank', 'Rohit', 'Vijay', 'Mohit', 'Chetan',
  'Ramesh', 'Alok', 'Vishal', 'Ajay', 'Lalit', 'Sunil', 'Parag', 'Naveen', 'Dinesh', 'Sachin'
];

const LAST_NAMES = [
  'Sharma', 'Singh', 'Kapoor', 'Mehra', 'Gupta', 'Verma', 'Malhotra', 'Nair', 'Reddy', 'Chawla',
  'Patel', 'Joshi', 'Bhasin', 'Khurana', 'Rao', 'Iyer', 'Deshmukh', 'Shah', 'Sen', 'Dutta',
  'Thakur', 'Bhatia', 'Chopra', 'Ahuja', 'Khanna', 'Agarwal', 'Bansal', 'Jain', 'Mehta', 'Soni',
  'Trivedi', 'Pandey', 'Mishra', 'Saxena', 'Kulkarni', 'Naik', 'Shetty', 'Pillai', 'Hegde', 'Kaushik'
];

const STYLISTS_LIST = ['Aarav Kapoor', 'Pooja Sharma', 'Rohan Verma', 'Karan Malhotra', 'Ananya Roy', 'Vikram Singh'];
const SERVICES_LIST = [
  'Hair Cut & Styling', 'Hair Spa & Keratin', 'Hydra Facial Glow', 'Balayage / Hair Color',
  'Beard Grooming & Shave', 'Pedicure & Manicure', 'Bridal Makeup', 'Detox Face Mask',
  'Root Touch-up', 'O3+ Facial', 'Hair Smoothening', 'Threading & Waxing'
];

const OCCUPATIONS = [
  'Software Engineer', 'Interior Designer', 'Doctor', 'Marketing Manager',
  'Architect', 'Business Analyst', 'Fashion Designer', 'HR Lead',
  'Entrepreneur', 'Financial Consultant', 'College Professor', 'Product Manager'
];

const CITIES_AREAS = [
  'Bandra West, Mumbai', 'Indiranagar, Bengaluru', 'Juhu, Mumbai', 'DLF Phase 5, Gurugram',
  'Koregaon Park, Pune', 'Jubilee Hills, Hyderabad', 'Connaught Place, New Delhi', 'Salt Lake, Kolkata',
  'Vasant Vihar, New Delhi', 'Powai, Mumbai', 'Alwarpet, Chennai', 'C-Scheme, Jaipur'
];

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250'
];

const PHOTO_GALLERY_SAMPLES = [
  { url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600', title: 'Balayage Color Result', category: 'Hair' as PhotoCategory },
  { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600', title: 'Hydra Facial Glow', category: 'Skin' as PhotoCategory },
  { url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600', title: 'Before Hair Care Session', category: 'Before' as PhotoCategory },
  { url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=600', title: 'After Keratin Smoothening', category: 'After' as PhotoCategory },
  { url: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b4?auto=format&fit=crop&q=80&w=600', title: 'Grooming & Beard Trim', category: 'Hair' as PhotoCategory }
];

export function generate100Customers(): Customer[] {
  const customers: Customer[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();

  for (let i = 1; i <= 100; i++) {
    const isFemale = i % 2 !== 0;
    const firstName = isFemale
      ? FIRST_NAMES_FEMALE[(i - 1) % FIRST_NAMES_FEMALE.length]
      : FIRST_NAMES_MALE[(i - 1) % FIRST_NAMES_MALE.length];
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    
    // Format Indian phone number
    const phonePrefix = ['98190', '98201', '98765', '99304', '98112', '97110', '98800', '98450'][i % 8];
    const phoneSuffix = String(10000 + (i * 87) % 90000);
    const phone = `+91 ${phonePrefix} ${phoneSuffix}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;

    // Dates
    const birthMonth = (i % 12);
    const birthDay = (i % 28) + 1;
    const isToday = (birthMonth === currentMonth && birthDay === today.getDate()) || i === 1 || i === 3;
    const isThisWeek = (birthMonth === currentMonth && Math.abs(birthDay - today.getDate()) <= 3) || i === 2 || i === 5;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dobFormatted = `${String(birthDay).padStart(2, '0')} ${monthNames[birthMonth]}`;
    const dobFull = `199${(i % 8) + 1}-${String(birthMonth + 1).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    // Membership tier
    let tier: MembershipTier = 'Normal';
    if (i % 10 === 0) tier = 'Platinum';
    else if (i % 5 === 0) tier = 'Gold';
    else if (i % 3 === 0) tier = 'Silver';

    const discountMap = { Normal: 0, Silver: 10, Gold: 15, Platinum: 25 };
    const benefitMap = {
      Normal: ['Standard Booking', '1 Loyalty Pt per ₹100'],
      Silver: ['10% Flat Service Discount', 'Free Welcome Drink', 'Priority Weekend Booking'],
      Gold: ['15% Flat Service Discount', 'Complimentary Scalp Massage', 'Free Birthday Upgrade'],
      Platinum: ['25% Flat Service Discount', 'VIP Suite Access', 'Free Guest Styling Pass', 'Personal Concierge']
    };

    // Lifetime metrics & visits
    const visitsCount = (i % 18) + 2;
    const avgSpendPerVisit = 800 + (i * 210) % 4500;
    const lifetimeSpend = visitsCount * avgSpendPerVisit;
    
    // Loyalty Points
    const lifetimePoints = Math.round(lifetimeSpend / 100);
    const redeemedPoints = Math.round(lifetimePoints * (0.2 + (i % 4) * 0.1));
    const availablePoints = Math.max(0, lifetimePoints - redeemedPoints);

    // Generate Visit History
    const visits = [];
    const visitCountToGenerate = Math.min(visitsCount, 6);
    for (let v = 1; v <= visitCountToGenerate; v++) {
      const invNo = `INV-2026-${String(9000 - i * 10 - v).padStart(4, '0')}`;
      const amount = 800 + ((i * 13 + v * 250) % 3500);
      const discount = Math.round(amount * (discountMap[tier] / 100));
      const baseAfterDiscount = amount - discount;
      const gst = Math.round(baseAfterDiscount * 0.18);
      const totalPaid = baseAfterDiscount + gst;

      visits.push({
        id: `v-${i}-${v}`,
        invoiceNo: invNo,
        date: `2026-0${Math.min(8, (v % 8) + 1)}-${String((v * 4) % 28 + 1).padStart(2, '0')}`,
        stylistName: STYLISTS_LIST[(i + v) % STYLISTS_LIST.length],
        services: [SERVICES_LIST[(i + v) % SERVICES_LIST.length], SERVICES_LIST[(i + v + 2) % SERVICES_LIST.length]],
        amount,
        discount,
        gst,
        totalPaid,
        paymentMethod: (['UPI', 'Card', 'Cash', 'Split'] as const)[(i + v) % 4],
        status: 'Completed' as const,
        notes: v === 1 ? 'Client praised scalp treatment & blow dry' : undefined,
      });
    }

    const lastVisitDate = visits[0]?.date || '2026-08-01';

    // Notes
    const notes = [
      {
        id: `note-${i}-1`,
        text: i % 2 === 0 ? 'Prefers ammonia-free hair color and gentle organic shampoos.' : 'Sensitive scalp; avoid harsh chemical bleaches.',
        author: 'Aarav Kapoor',
        createdAt: '2026-07-20',
        isImportant: true,
      },
      {
        id: `note-${i}-2`,
        text: 'Enjoys complimentary green tea during facial treatment.',
        author: 'Reception Desk',
        createdAt: '2026-08-02',
      }
    ];

    // Photos
    const photos = [
      {
        id: `photo-${i}-1`,
        url: PHOTO_GALLERY_SAMPLES[(i % PHOTO_GALLERY_SAMPLES.length)].url,
        category: PHOTO_GALLERY_SAMPLES[(i % PHOTO_GALLERY_SAMPLES.length)].category,
        title: PHOTO_GALLERY_SAMPLES[(i % PHOTO_GALLERY_SAMPLES.length)].title,
        uploadedAt: '2026-07-15',
      }
    ];

    customers.push({
      id: `CUST-${String(1000 + i)}`,
      firstName,
      lastName,
      fullName,
      phone,
      email,
      gender: isFemale ? 'Female' : 'Male',
      dob: dobFull,
      birthdayFormatted: dobFormatted,
      isBirthdayToday: isToday,
      isBirthdayThisWeek: isThisWeek,
      photoUrl: SAMPLE_AVATARS[i % SAMPLE_AVATARS.length],
      address: `${10 + (i % 80)}, ${CITIES_AREAS[i % CITIES_AREAS.length]}`,
      emergencyContact: `+91 98200 ${String(11000 + i * 12)}`,
      occupation: OCCUPATIONS[i % OCCUPATIONS.length],
      referralSource: (['Instagram', 'Walk-in', 'Friend Referral', 'Google Search', 'Flyer'] as const)[i % 5],
      
      status: i % 15 === 0 ? 'VIP' : i % 25 === 0 ? 'Inactive' : 'Active',
      membership: {
        tier,
        joiningDate: `2025-0${(i % 9) + 1}-15`,
        renewalDate: `2027-0${(i % 9) + 1}-15`,
        discountPercent: discountMap[tier],
        benefits: benefitMap[tier],
      },

      preferredStylist: STYLISTS_LIST[i % STYLISTS_LIST.length],
      preferredServices: [SERVICES_LIST[i % SERVICES_LIST.length], SERVICES_LIST[(i + 3) % SERVICES_LIST.length]],
      skinType: (['Combination', 'Oily', 'Sensitive', 'Dry', 'Normal'] as const)[i % 5],
      hairType: (['Straight Wavy', 'Curly / Frizzy', 'Thin Straight', 'Thick Coarse', 'Color Treated'] as const)[i % 5],
      
      medicalInfo: {
        allergies: i % 3 === 0 ? ['Bleach powder', 'Ammonia'] : ['None reported'],
        skinSensitivity: i % 2 === 0 ? 'Moderate redness with steam' : 'Normal / Resilient',
        hairConcerns: ['Hairfall', 'Scalp dryness', 'Split ends'],
        chemicalHistory: 'Keratin smoothing done 4 months ago; lightened highlights',
        medicalConditions: i % 7 === 0 ? ['Mild Asthma'] : ['None'],
        specialInstructions: 'Always test patch 10 mins prior to active hair coloring.',
      },

      loyalty: {
        currentPoints: availablePoints,
        lifetimePoints,
        redeemedPoints,
        availablePoints,
      },

      visitsCount,
      lifetimeSpend,
      lastVisitDate,
      createdAt: `2025-0${(i % 9) + 1}-10`,

      visits,
      notes,
      photos,
    });
  }

  return customers;
}

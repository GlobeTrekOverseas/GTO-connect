import importedUniversities from './imported-universities.json';

export const F = (code: string) => `https://flagcdn.com/w80/${code}.png`;

export interface University {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  rank: string;
  rankNum: number;
  tuition: string;
  courses: string;
  established: number;
  type: string;
  ielts: string;
  intake: string;
  image: string;
  website?: string;
  address?: string;
  campuses?: string;
}

const IMG = (_id: string) => '/university-toronto-hero.png';

const FEATURED_UNIVERSITIES: University[] = [
  { id:1,  name:'University of Toronto',          country:'Canada',      countryCode:'ca', rank:'#21 in the World', rankNum:21,  tuition:'CAD 29,000/yr', courses:'300+ Courses', established:1827, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Sep, Jan, May',  image:'/university-toronto-hero.png' },
  { id:2,  name:'University of Melbourne',         country:'Australia',   countryCode:'au', rank:'#33 in the World', rankNum:33,  tuition:'AUD 32,000/yr', courses:'450+ Courses', established:1853, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Feb, Jul',      image:IMG('photo-1556761175-b413da4baf72') },
  { id:3,  name:'University College London',       country:'UK',          countryCode:'gb', rank:'#8 in the World',  rankNum:8,   tuition:'£38,000/yr',    courses:'400+ Courses', established:1826, type:'Public Research University', ielts:'7.0 (no band less than 6.5)', intake:'Sep',           image:IMG('photo-1548013146-72479768bada') },
  { id:4,  name:'University of California, LA',    country:'USA',         countryCode:'us', rank:'#15 in the World', rankNum:15,  tuition:'$44,000/yr',    courses:'350+ Courses', established:1919, type:'Public Research University', ielts:'7.0 (no band less than 6.0)', intake:'Sep, Jan',      image:IMG('photo-1562774053-701939374585') },
  { id:5,  name:'Imperial College London',         country:'UK',          countryCode:'gb', rank:'#6 in the World',  rankNum:6,   tuition:'£35,000/yr',    courses:'150+ Courses', established:1907, type:'Public Research University', ielts:'7.0 (no band less than 6.5)', intake:'Sep',           image:IMG('photo-1541339907198-e08756dedf3f') },
  { id:6,  name:'ETH Zurich',                      country:'Switzerland', countryCode:'ch', rank:'#7 in the World',  rankNum:7,   tuition:'CHF 730/yr',    courses:'150+ Courses', established:1855, type:'Public Research University', ielts:'7.0 (no band less than 6.5)', intake:'Sep',           image:IMG('photo-1580582932707-520aed937b7b') },
  { id:7,  name:'McGill University',               country:'Canada',      countryCode:'ca', rank:'#46 in the World', rankNum:46,  tuition:'CAD 22,000/yr', courses:'300+ Courses', established:1821, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Sep, Jan',      image:IMG('photo-1607237138185-eedd9c632b0b') },
  { id:8,  name:'University of Sydney',            country:'Australia',   countryCode:'au', rank:'#19 in the World', rankNum:19,  tuition:'AUD 34,000/yr', courses:'350+ Courses', established:1850, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Feb, Jul',      image:IMG('photo-1589802829985-817e51171b92') },
  { id:9,  name:'University of Edinburgh',         country:'UK',          countryCode:'gb', rank:'#27 in the World', rankNum:27,  tuition:'£24,000/yr',    courses:'500+ Courses', established:1583, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Sep',           image:IMG('photo-1569949380892-f42e5a3dded7') },
  { id:10, name:'University of British Columbia',  country:'Canada',      countryCode:'ca', rank:'#38 in the World', rankNum:38,  tuition:'CAD 27,000/yr', courses:'270+ Courses', established:1908, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Sep, Jan',      image:IMG('photo-1523050854058-8df90110c9f1') },
  { id:11, name:'Technical University of Munich',  country:'Germany',     countryCode:'de', rank:'#30 in the World', rankNum:30,  tuition:'€300/semester', courses:'200+ Courses', established:1868, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Oct, Apr',      image:IMG('photo-1481627834876-b7833e8f5570') },
  { id:12, name:'Monash University',               country:'Australia',   countryCode:'au', rank:'#37 in the World', rankNum:37,  tuition:'AUD 30,000/yr', courses:'320+ Courses', established:1958, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Feb, Jul',      image:IMG('photo-1562774053-701939374585') },
  { id:13, name:'Trinity College Dublin',          country:'Ireland',     countryCode:'ie', rank:'#87 in the World', rankNum:87,  tuition:'€19,000/yr',    courses:'200+ Courses', established:1592, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Sep',           image:IMG('photo-1580582932707-520aed937b7b') },
  { id:14, name:'University of Auckland',          country:'New Zealand', countryCode:'nz', rank:'#65 in the World', rankNum:65,  tuition:'NZD 30,000/yr', courses:'220+ Courses', established:1883, type:'Public Research University', ielts:'6.0 (no band less than 5.5)', intake:'Feb, Jul',      image:IMG('photo-1523050854058-8df90110c9f1') },
  { id:15, name:'National Univ. of Singapore',     country:'Singapore',   countryCode:'sg', rank:'#8 in the World',  rankNum:8,   tuition:'SGD 26,000/yr', courses:'250+ Courses', established:1905, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Aug',           image:IMG('photo-1589802829985-817e51171b92') },
  { id:16, name:'University of Waterloo',          country:'Canada',      countryCode:'ca', rank:'#112 in the World',rankNum:112, tuition:'CAD 38,000/yr', courses:'120+ Courses', established:1957, type:'Public Research University', ielts:'6.5 (no band less than 6.0)', intake:'Sep, Jan, May', image:IMG('photo-1607237138185-eedd9c632b0b') },
];

const PDF_UNIVERSITY_DETAILS: Record<string, Pick<University, 'website' | 'ielts'>> = {
  "AGI Education Limited": {
    "website": "https://www.agi.ac.nz/",
    "ielts": "Overall IELTS requirement is 6 Bands"
  },
  "AMDA College and Conservatory of the Performing Arts": {
    "website": "https://www.amda.edu/",
    "ielts": "Overall IELTS requirement is 6 Bands"
  },
  "ATMC New Zealand": {
    "website": "https://atmc.ac.nz/",
    "ielts": "Overall IELTS requirement is 6 Bands (no less than 5.5)"
  },
  "AURA International School of Management": {
    "website": "https://aura-group.com/",
    "ielts": "Overall IELTS requirement is 6.0 Bands"
  },
  "Abilene Christian University": {
    "website": "https://acu.edu/",
    "ielts": "Not mentioned in the partner directory"
  },
  "Adelphi University": {
    "website": "https://www.adelphi.edu/",
    "ielts": "Overall IELTS requirement is 6.5 Bands"
  },
  "AcademyEX": {
    "website": "https://academyex.com/",
    "ielts": "Overall IELTS requirement is 6.5 Bands"
  },
  "Adler University": {
    "website": "https://www.adler.edu/campuses/",
    "ielts": "Degree and graduate certificates require IELTS 7"
  },
  "Aivancity School for Technology Business and Society": {
    "website": "https://www.aivancity.ai/",
    "ielts": "Not mentioned in the partner directory"
  },
  "Alexander College": {
    "website": "https://alexandercollege.ca/",
    "ielts": "Not mentioned in the partner directory"
  },
  "Albertus Magnus College": {
    "website": "https://www.albertus.edu/",
    "ielts": "Not mentioned in the partner directory"
  }
};

type ImportedUniversityDetails = (typeof importedUniversities)[number] & {
  website?: string;
  ielts?: string;
};

const IMPORTED_UNIVERSITIES: University[] = (importedUniversities as ImportedUniversityDetails[]).map((university, index) => {
  const directoryDetails = PDF_UNIVERSITY_DETAILS[university.name];
  return ({
  id: FEATURED_UNIVERSITIES.length + index + 1,
  ...university,
  rank: 'Partner university',
  rankNum: 1000 + index,
  established: 0,
  type: 'International education partner',
  ielts: directoryDetails?.ielts ?? university.ielts ?? 'Check course requirements',
  website: directoryDetails?.website ?? university.website,
  image: '/university-toronto-hero.png',
  });
});

export const UNIVERSITIES: University[] = [...FEATURED_UNIVERSITIES, ...IMPORTED_UNIVERSITIES];

export const DESTINATIONS = Array.from(
  new Map(UNIVERSITIES.map(university => [university.country, university.countryCode])).entries(),
).map(([name, code]) => ({ flag: F(code), name, code }));

export const INTAKES = [
  { label: 'Sep 2024', sub: 'Apply Now',   active: true  },
  { label: 'Jan 2025', sub: 'Apply Now',   active: true  },
  { label: 'May 2025', sub: 'Apply Now',   active: false },
  { label: 'Sep 2025', sub: 'Coming Soon', active: false },
];

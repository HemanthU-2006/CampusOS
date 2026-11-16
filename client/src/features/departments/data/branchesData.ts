export interface DepartmentBranch {
  code: string;
  name: string;
  hod: string;
  qualification: string;
  hodEmail?: string;
  established: number;
  intake: number;
  block: string;
  scheme: string;
  description: string;
  labs: string[];
  specializations: string[];
  facultyCount: number;
  hasFacultyPage?: boolean;
  facultyRoute?: string;
  accreditation: string;
}

export const SJBIT_BRANCHES: DepartmentBranch[] = [
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hod: 'Dr. Krishna A N',
    qualification: 'M.Tech., Ph.D., Professor & HOD',
    hodEmail: 'hodcse@sjbit.edu.in',
    established: 2001,
    intake: 180,
    block: 'Aryabhata Block, 2nd & 3rd Floors',
    scheme: '2022 Scheme (VTU Autonomous)',
    description:
      'The Department of Computer Science & Engineering offers cutting-edge education in algorithmic thinking, scalable software architecture, cloud platforms, and distributed systems, accredited by NBA.',
    labs: [
      'Advanced Computing & Algorithm Lab',
      'AI & Data Engineering Research Lab',
      'Cloud Computing & Virtualization Lab',
      'Network Simulation & Cybersecurity Lab',
      'Open Source Software Innovation Lab',
    ],
    specializations: [
      'Cloud & Distributed Systems',
      'Full Stack Software Architecture',
      'Algorithms & Computational Theory',
      'Computer Vision & Pattern Recognition',
    ],
    facultyCount: 38,
    accreditation: 'NBA Accredited · NAAC A+',
  },
  {
    code: 'ISE',
    name: 'Information Science & Engineering',
    hod: 'Dr. Gopalakrishna M T',
    qualification: 'M.Tech., Ph.D., Professor & HOD',
    hodEmail: 'hodise@sjbit.edu.in',
    established: 2001,
    intake: 180,
    block: 'Aryabhata Block, 1st Floor',
    scheme: '2022 Scheme (VTU Autonomous)',
    description:
      'Department of Information Science & Engineering focuses on data-driven computing, applied AI, cybersecurity, and modern web architectures, powered by 41 distinguished faculty and technical staff.',
    labs: [
      'Machine Learning & Data Intelligence Lab',
      'Cryptography & Network Security Lab',
      'Web Technologies & Microservices Lab',
      'Mobile Application Engineering Lab',
      'Database Systems & Big Data Lab',
    ],
    specializations: [
      'Applied Artificial Intelligence',
      'Cybersecurity & Network Defense',
      'Modern Web Technologies',
      'Big Data Analytics & IoT',
    ],
    facultyCount: 41,
    hasFacultyPage: true,
    facultyRoute: '/faculty/ise',
    accreditation: 'NBA Accredited · NAAC A+',
  },
  {
    code: 'AI&ML',
    name: 'Artificial Intelligence & Machine Learning',
    hod: 'Dr. Abhilash C N',
    qualification: 'M.Tech., Ph.D., Associate Professor & HOD',
    hodEmail: 'hodaiml@sjbit.edu.in',
    established: 2020,
    intake: 120,
    block: 'Sir M.V. Block, 3rd Floor',
    scheme: '2022 Scheme (VTU Autonomous)',
    description:
      'Dedicated to advanced neural architectures, deep learning models, natural language processing, and autonomous robotic perception, backed by NVIDIA GPU compute clusters.',
    labs: [
      'Deep Learning & GPU Computing Lab',
      'Computer Vision & Image Processing Lab',
      'Natural Language Processing Lab',
      'Autonomous Systems & Robotics Lab',
    ],
    specializations: [
      'Deep Neural Architectures',
      'Natural Language Processing & LLMs',
      'Computer Vision & Autonomous Perception',
      'Reinforcement Learning & Robotics',
    ],
    facultyCount: 18,
    accreditation: 'VTU Autonomous · NAAC A+',
  },
  {
    code: 'CS-DS',
    name: 'CSE (Data Science)',
    hod: 'Dr. Chandrashekar D K (I/C)',
    qualification: 'M.Tech., Ph.D., Professor & HOD I/C',
    hodEmail: 'hodds@sjbit.edu.in',
    established: 2022,
    intake: 60,
    block: 'Sir M.V. Block, 2nd Floor',
    scheme: '2022 Scheme (VTU Autonomous)',
    description:
      'Specialized engineering branch synthesizing statistical machine learning, big data streaming frameworks, predictive modeling, and executive business analytics.',
    labs: [
      'Big Data Ecosystems Lab (Hadoop/Spark)',
      'Predictive Modeling & Statistical Computing Lab',
      'Data Visualization & Business Analytics Lab',
      'Cloud Data Warehousing Lab',
    ],
    specializations: [
      'Big Data Engineering & Pipelines',
      'Statistical Machine Learning',
      'Business Intelligence & Decision Science',
      'Data Mining & Warehousing',
    ],
    facultyCount: 14,
    accreditation: 'VTU Autonomous · NAAC A+',
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    hod: 'Dr. Chandrappa D N',
    qualification: 'M.Tech., Ph.D., Professor & HOD',
    hodEmail: 'hodece@sjbit.edu.in',
    established: 2001,
    intake: 180,
    block: 'C.V. Raman Block, 2nd & 3rd Floors',
    scheme: '2022 Scheme (VTU Autonomous)',
    description:
      'Premier department accredited by NBA, pioneering research in VLSI chip design, embedded IoT architectures, 5G wireless telecommunications, and digital signal processing.',
    labs: [
      'VLSI & ASIC Chip Design Lab (Cadence/Synopsys)',
      'DSP & Advanced Embedded Systems Lab',
      'Microwave, Antenna & RF Engineering Lab',
      'IoT, Sensor Networks & Embedded Robotics Lab',
      'Analog & Digital Communications Lab',
    ],
    specializations: [
      'VLSI & Embedded Systems Design',
      '5G Wireless Communication & Networks',
      'Digital Signal & Image Processing',
      'IoT & Industrial Cyber-Physical Systems',
    ],
    facultyCount: 34,
    accreditation: 'NBA Accredited · NAAC A+',
  },
  {
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    hod: 'Dr. Chandrashekar M J',
    qualification: 'M.Tech., Ph.D., Professor & HOD',
    hodEmail: 'hodeee@sjbit.edu.in',
    established: 2004,
    intake: 60,
    block: 'C.V. Raman Block, 1st Floor',
    scheme: '2022 Scheme (VTU Autonomous)',
    description:
      'Specializing in electrical smart grids, power electronic drives, electric vehicle (EV) powertrain systems, and renewable green energy integration.',
    labs: [
      'Power Electronics & Industrial Drives Lab',
      'High Voltage & Electrical Machines Lab',
      'Smart Grid & Renewable Energy Simulation Lab',
      'Control Systems & Microcontroller Lab',
    ],
    specializations: [
      'Electric Vehicle (EV) Powertrains',
      'Renewable Energy & Solar Smart Grids',
      'Industrial Automation & Drives',
      'Power System Protection & High Voltage',
    ],
    facultyCount: 16,
    accreditation: 'NBA Accredited · NAAC A+',
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering',
    hod: 'Dr. Vitala H.R',
    qualification: 'M.Tech., Ph.D., Professor & HOD',
    hodEmail: 'hodmech@sjbit.edu.in',
    established: 2001,
    intake: 60,
    block: 'Mechanical Block & Central Workshops',
    scheme: '2022 Scheme (VTU Autonomous)',
    description:
      'Combines classic mechanical thermodynamics and materials engineering with modern computer-integrated manufacturing (CIM), robotics, and industrial 3D additive manufacturing.',
    labs: [
      'Computer Integrated Manufacturing & Robotics Lab',
      'Heat Transfer, Fluid Dynamics & IC Engines Lab',
      'Metallurgy & Material Testing Lab',
      'Central CAD/CAM & Additive Manufacturing Workshop',
    ],
    specializations: [
      'Robotics & Industrial Mechatronics',
      'Thermal Sciences & Energy Systems',
      'Advanced Materials & Manufacturing',
      'Computer-Aided Design & Engineering (CAD/CAE)',
    ],
    facultyCount: 18,
    accreditation: 'NBA Accredited · NAAC A+',
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering',
    hod: 'Dr. Prasad C S M V',
    qualification: 'M.Tech., Ph.D., Professor & HOD',
    hodEmail: 'hodcivil@sjbit.edu.in',
    established: 2009,
    intake: 60,
    block: 'Civil Engineering Block & CAD Labs',
    scheme: '2022 Scheme (VTU Autonomous)',
    description:
      'Provides hands-on education in structural design, geotechnical foundation analysis, environmental hydraulics, and modern GIS/Total Station surveying.',
    labs: [
      'Structural Dynamics & Concrete Testing Lab',
      'Geotechnical & Soil Mechanics Lab',
      'Environmental Engineering & Water Quality Lab',
      'Total Station Surveying & Remote Sensing GIS Lab',
    ],
    specializations: [
      'Structural Engineering & Earthquake Resilient Design',
      'Geotechnical & Transportation Engineering',
      'Environmental & Water Resource Management',
      'GIS, Remote Sensing & Digital Cartography',
    ],
    facultyCount: 16,
    accreditation: 'NBA Accredited · NAAC A+',
  },
  {
    code: 'MBA',
    name: 'Department of Management Studies',
    hod: 'Dr. Mamatha J',
    qualification: 'MBA, Ph.D., Professor & HOD',
    hodEmail: 'hodmba@sjbit.edu.in',
    established: 2008,
    intake: 120,
    block: 'MBA & PG Studies Block, 4th Floor',
    scheme: 'Autonomous PG Scheme',
    description:
      'Autonomous postgraduate department nurturing strategic managerial leaders across corporate finance, business analytics, digital marketing, and talent acquisition.',
    labs: [
      'Business Analytics & Financial Modeling Lab',
      'Executive Digital Marketing & Strategy Lab',
      'Communication & Corporate Grooming Studio',
    ],
    specializations: [
      'Corporate Finance & Investment Banking',
      'Digital Marketing & Brand Management',
      'Human Resource Talent & Organization Dynamics',
      'Business Analytics & Data-Driven Management',
    ],
    facultyCount: 14,
    accreditation: 'VTU Autonomous · NAAC A+',
  },
];

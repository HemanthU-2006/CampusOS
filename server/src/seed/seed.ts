import mongoose from 'mongoose';
import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {}
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Venue } from '../models/Venue.js';
import { Club } from '../models/Club.js';
import { ClubPost } from '../models/ClubPost.js';
import { Resource } from '../models/Resource.js';
import { Event } from '../models/Event.js';
import { MaintenanceTicket } from '../models/MaintenanceTicket.js';
import { LostFoundItem } from '../models/LostFoundItem.js';
import { Course } from '../models/Course.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Booking } from '../models/Booking.js';
import { Notification } from '../models/Notification.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to MongoDB for seeding...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to DB. Clearing existing data...');

    // Clear collections
    await Promise.all([
      User.deleteMany({}),
      Venue.deleteMany({}),
      Club.deleteMany({}),
      ClubPost.deleteMany({}),
      Resource.deleteMany({}),
      Event.deleteMany({}),
      MaintenanceTicket.deleteMany({}),
      LostFoundItem.deleteMany({}),
      Course.deleteMany({}),
      AttendanceRecord.deleteMany({}),
      Booking.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('🧹 Database cleared.');

    // 1. Seed Demo Users for every role
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('Password123!', salt);

    const users = await User.create([
      {
        name: 'Arjun Mehta (Admin)',
        email: 'admin@campus.edu',
        password: defaultPassword,
        role: 'admin',
        department: 'Campus Administration',
        phone: '+91 98765 43210',
        activityPoints: 500,
      },
      {
        name: 'Dr. Sarah Jenkins',
        email: 'faculty@campus.edu',
        password: defaultPassword,
        role: 'faculty',
        department: 'Computer Science & Engineering',
        phone: '+91 98765 43211',
        activityPoints: 350,
      },
      {
        name: 'Rohan Sharma',
        email: 'clubhead@campus.edu',
        password: defaultPassword,
        role: 'club_head',
        department: 'Information Technology',
        rollNumber: 'IT-2023-042',
        phone: '+91 98765 43212',
        activityPoints: 280,
      },
      {
        name: 'Suresh Kumar',
        email: 'maintenance@campus.edu',
        password: defaultPassword,
        role: 'maintenance',
        department: 'Campus Facilities & Services',
        phone: '+91 98765 43213',
        activityPoints: 120,
      },
      {
        name: 'Priya Patel (Student)',
        email: 'student@campus.edu',
        password: defaultPassword,
        role: 'student',
        department: 'Computer Science',
        rollNumber: 'CS-2024-108',
        phone: '+91 98765 43214',
        activityPoints: 160,
      },
    ]);

    const adminUser = users[0];
    const facultyUser = users[1];
    const clubHeadUser = users[2];
    const maintenanceUser = users[3];
    const studentUser = users[4];

    console.log(`👤 Seeded 5 Demo Users (Password: Password123!)`);

    // 2. Seed Venues
    const venues = await Venue.create([
      {
        name: 'Main Auditorium (Hall A)',
        code: 'AUD-A',
        capacity: 450,
        building: 'Academic Block 1',
        floor: 1,
        amenities: [
          '4K Projector',
          'Stage Lights',
          'Surround Sound',
          'Central AC',
          'Wireless Mics',
        ],
        isAvailable: true,
      },
      {
        name: 'Alan Turing Seminar Hall',
        code: 'SEM-TUR',
        capacity: 120,
        building: 'Computer Science Complex',
        floor: 2,
        amenities: ['Smart Podium', 'Dual Projectors', 'Recording Camera', 'AC'],
        isAvailable: true,
      },
      {
        name: 'Innovation & Robotics Lab',
        code: 'LAB-INNOV',
        capacity: 60,
        building: 'R&D Center',
        floor: 3,
        amenities: ['High-speed LAN', '3D Printers', 'Soldering Stations', 'Oscilloscopes'],
        isAvailable: true,
      },
      {
        name: 'Open Air Amphitheatre',
        code: 'AMPHI-01',
        capacity: 600,
        building: 'Student Activity Hub',
        floor: 0,
        amenities: ['Floodlights', 'Tiered Seating', 'Acoustic Wall'],
        isAvailable: true,
      },
    ]);
    console.log(`🏛️ Seeded ${venues.length} Campus Venues`);

    // 3. Seed Clubs
    const clubs = await Club.create([
      {
        name: 'Robotics & AI Guild',
        code: 'ROBO-AI',
        description:
          'Building autonomous rovers, drones, and machine learning models for national hackathons.',
        category: 'Technical',
        lead: clubHeadUser._id,
        members: [clubHeadUser._id, studentUser._id],
        isActive: true,
      },
      {
        name: 'Design & Web Society',
        code: 'DWS',
        description: 'Cultivating digital product design, modern web standards, and UI/UX crafts.',
        category: 'Creative',
        lead: clubHeadUser._id,
        members: [studentUser._id],
        isActive: true,
      },
      {
        name: 'E-Cell Entrepreneurship Hub',
        code: 'ECELL',
        description:
          'Incubating student-led startups with mentorship, pitch workshops, and seed funding.',
        category: 'Business',
        lead: clubHeadUser._id,
        members: [studentUser._id, facultyUser._id],
        isActive: true,
      },
    ]);
    console.log(`🚀 Seeded ${clubs.length} Clubs`);

    // 4. Seed Club Posts
    await ClubPost.create([
      {
        club: clubs[0]._id,
        author: clubHeadUser._id,
        title: 'Call for Hardware Sub-team Members — Autonomous Rover Challenge',
        content:
          'We are scouting students with interest in ESP32, ROS2, and LiDAR navigation. Weekly workshops start this Thursday at the Innovation Lab.',
      },
      {
        club: clubs[1]._id,
        author: clubHeadUser._id,
        title: 'Design Critique Session & Figma to Code Workshop',
        content:
          'Join us for a hands-on teardown of modern obsidian and dark glassy interfaces. Bring your laptops!',
      },
    ]);

    // 5. Seed Resources
    const resources = await Resource.create([
      {
        name: 'Sony Alpha 7 IV 4K Kit',
        category: 'Media Gear',
        totalQuantity: 3,
        availableQuantity: 2,
        location: 'Media Center Room 104',
        condition: 'good',
        description: 'Full-frame mirrorless camera with 24-70mm f/2.8 lens for event coverage.',
      },
      {
        name: 'Meta Quest 3 VR Headset (512GB)',
        category: 'VR / Hardware',
        totalQuantity: 6,
        availableQuantity: 5,
        location: 'CS Advanced Labs',
        condition: 'new',
        description: 'Mixed reality headset for spatial computing and 3D simulation research.',
      },
      {
        name: 'Arduino Mega & Sensor Pro Kit',
        category: 'Electronics',
        totalQuantity: 20,
        availableQuantity: 18,
        location: 'Electronics Lab Storage B',
        condition: 'good',
        description: 'Over 40 sensors, motors, and LCD modules for embedded engineering.',
      },
      {
        name: 'JBL EON Portable PA Sound System',
        category: 'Audio',
        totalQuantity: 4,
        availableQuantity: 4,
        location: 'Facilities Equipment Cage',
        condition: 'good',
        description: 'Battery-powered Bluetooth loudspeaker with two wireless microphones.',
      },
    ]);
    console.log(`📦 Seeded ${resources.length} Equipment Resources`);

    // 6. Seed Events
    const now = new Date();
    const futureEventDate1 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const futureEventDate2 = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);

    const events = await Event.create([
      {
        title: 'HackCampus 2026: 36-Hour National Hackathon',
        description:
          'Annual flagship hackathon bringing over 300 builders across Web3, AI Agents, and IoT hardware.',
        organizer: facultyUser._id,
        club: clubs[0]._id,
        venue: venues[0]._id,
        startTime: futureEventDate1,
        endTime: new Date(futureEventDate1.getTime() + 36 * 60 * 60 * 1000),
        capacity: 250,
        registeredCount: 184,
        waitlistCount: 12,
        status: 'published',
        tags: ['Hackathon', 'AI', 'Coding', 'Prizes'],
      },
      {
        title: 'Frontiers of Autonomous Robotics: Guest Keynote',
        description:
          'Distinguished lecture on SLAM navigation and humanoid manipulation in unstructured environments.',
        organizer: clubHeadUser._id,
        club: clubs[0]._id,
        venue: venues[1]._id,
        startTime: futureEventDate2,
        endTime: new Date(futureEventDate2.getTime() + 3 * 60 * 60 * 1000),
        capacity: 120,
        registeredCount: 85,
        waitlistCount: 0,
        status: 'published',
        tags: ['Robotics', 'Keynote', 'Research'],
      },
    ]);
    console.log(`🎉 Seeded ${events.length} Events`);

    // 7. Seed Sample Booking
    await Booking.create([
      {
        venue: venues[1]._id,
        user: facultyUser._id,
        title: 'Mid-term Algorithms Colloquium',
        description: 'Departmental paper presentations and technical review.',
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        status: 'approved',
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        reviewComment: 'Approved. AV technician notified.',
      },
    ]);

    // 8. Seed Maintenance Tickets
    await MaintenanceTicket.create([
      {
        title: 'HVAC Chiller Leak in CS Turing Hall',
        description: 'Water dripping near rear projector rack 4. Potential short circuit hazard.',
        category: 'hvac',
        priority: 'high',
        status: 'assigned',
        location: 'CS Complex 2nd Floor, Room 204',
        reportedBy: studentUser._id,
        assignedTo: maintenanceUser._id,
        photos: [],
        comments: [
          {
            author: maintenanceUser._id,
            content: 'Parts inspected. Replacing drainage valve pipe tomorrow at 8:00 AM.',
            createdAt: new Date(),
          },
        ],
      },
      {
        title: 'Lab 3 Ethernet Switch Port 12 Failure',
        description: 'Benches 4 to 6 have dropped LAN connection.',
        category: 'it_hardware',
        priority: 'medium',
        status: 'open',
        location: 'Innovation Lab 3',
        reportedBy: facultyUser._id,
        photos: [],
      },
    ]);
    console.log(`🔧 Seeded Maintenance Tickets`);

    // 9. Seed Lost & Found Items
    await LostFoundItem.create([
      {
        title: 'Matte Blue Hydro Flask (32oz)',
        description: 'Found under desk row 3 in Alan Turing Seminar Hall after 4:00 PM lecture.',
        category: 'Bottles & Containers',
        type: 'found',
        status: 'open',
        location: 'Turing Seminar Hall',
        reportedBy: studentUser._id,
        tags: ['bottle', 'blue', 'turing', 'flask'],
      },
      {
        title: 'Casio fx-991EX ClassWiz Calculator',
        description:
          'Misplaced during Engineering Mathematics tutorial. Has a small cat sticker on cover.',
        category: 'Electronics',
        type: 'lost',
        status: 'open',
        location: 'Academic Block 1 Room 102',
        reportedBy: studentUser._id,
        tags: ['calculator', 'casio', 'math'],
      },
    ]);
    console.log(`🔍 Seeded Lost & Found items`);

    // 10. Seed Course & Attendance Record
    const course = await Course.create({
      name: 'CS301 - Distributed Systems & Cloud Platforms',
      code: 'CS301',
      faculty: facultyUser._id,
      department: 'Computer Science',
      semester: 5,
      enrolledStudents: [studentUser._id],
    });

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    await AttendanceRecord.create({
      course: course._id,
      student: studentUser._id,
      date: todayDate,
      status: 'present',
      markedBy: facultyUser._id,
      remarks: 'Active participant in Raft consensus discussion.',
    });
    console.log(`📚 Seeded Courses and Attendance`);

    // 11. Seed Welcome Notification
    await Notification.create({
      user: studentUser._id,
      title: 'Welcome to CampusOS!',
      message: 'Your unified campus account is active. Explore venues, events, and resources.',
      type: 'system',
      link: '/dashboard',
    });

    console.log('\n=============================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Demo Credentials (All passwords: Password123!):');
    console.log('  👑 Admin:       admin@campus.edu');
    console.log('  👨‍🏫 Faculty:     faculty@campus.edu');
    console.log('  🚀 Club Head:   clubhead@campus.edu');
    console.log('  🛠️ Maintenance: maintenance@campus.edu');
    console.log('  🎓 Student:     student@campus.edu');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();

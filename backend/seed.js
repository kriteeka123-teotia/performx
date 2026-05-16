import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Goal from './models/Goal.js';
import connectDB from './config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Goal.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@performx.com',
      password: hashedPassword,
      role: 'Admin',
      department: 'HR'
    });

    // Create Managers
    const manager1 = await User.create({
      name: 'Sarah Manager',
      email: 'manager1@performx.com',
      password: hashedPassword,
      role: 'Manager',
      department: 'Engineering'
    });

    const manager2 = await User.create({
      name: 'John Manager',
      email: 'manager2@performx.com',
      password: hashedPassword,
      role: 'Manager',
      department: 'Sales'
    });

    // Create Employees
    await User.create([
      {
        name: 'Alice Employee',
        email: 'employee1@performx.com',
        password: hashedPassword,
        role: 'Employee',
        managerId: manager1._id,
        department: 'Engineering'
      },
      {
        name: 'Bob Employee',
        email: 'employee2@performx.com',
        password: hashedPassword,
        role: 'Employee',
        managerId: manager1._id,
        department: 'Engineering'
      },
      {
        name: 'Charlie Employee',
        email: 'employee3@performx.com',
        password: hashedPassword,
        role: 'Employee',
        managerId: manager2._id,
        department: 'Sales'
      }
    ]);

    console.log('Database Seeded Successfully!');
    console.log('---------------------------------');
    console.log('Demo Credentials (Password for all: demo123):');
    console.log('Admin: admin@performx.com');
    console.log('Manager: manager1@performx.com');
    console.log('Employee: employee1@performx.com');
    console.log('---------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();

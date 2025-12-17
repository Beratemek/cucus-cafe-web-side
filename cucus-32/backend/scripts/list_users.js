const mongoose = require('mongoose');
const User = require('../models/user');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name surname email role loyalty.sadakat_no');
    
    console.log('\n--- Kullanıcı Listesi ---');
    users.forEach(u => {
      console.log(`Name: ${u.name} ${u.surname} | Email: ${u.email} | Role: ${u.role} | ID: ${u._id}`);
    });
    console.log('-------------------------\n');

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listUsers();

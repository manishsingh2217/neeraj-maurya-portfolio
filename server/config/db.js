const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnected = false;
let useLocalStore = false;

// Ensure data and upload directories exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.join(__dirname, '..', 'uploads');
['resumes', 'images', 'certificates', 'thumbnails'].forEach(sub => {
  const p = path.join(uploadsDir, sub);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neeraj_portfolio';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    useLocalStore = false;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB (${error.message}).`);
    console.log(`[Storage Notice]: Activating embedded JSON persistent storage engine at ${path.join(dataDir, 'portfolio_data.json')}.`);
    isConnected = false;
    useLocalStore = true;
    return false;
  }
};

const getStatus = () => ({
  isConnected,
  useLocalStore,
  mode: isConnected ? 'MongoDB Native' : 'Embedded JSON Store (Active & Persistent)'
});

module.exports = { connectDB, getStatus, isConnected: () => isConnected, useLocalStore: () => useLocalStore };

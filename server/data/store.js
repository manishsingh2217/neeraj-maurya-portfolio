const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { isConnected } = require('../config/db');

const DATA_FILE = path.join(__dirname, 'portfolio_data.json');

// Default initial state
const getInitialState = () => ({
  admins: [],
  profiles: [],
  about: [],
  skills: [],
  experiences: [],
  projects: [],
  education: [],
  certifications: [],
  resumes: [],
  contactMessages: [],
  socialLinks: [],
  websiteSettings: [],
  visitorAnalytics: [],
  activityLogs: []
});

class StoreManager {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(getInitialState(), null, 2), 'utf-8');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading JSON store:', err.message);
      return getInitialState();
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing JSON store:', err.message);
    }
  }

  // Model-like adapter for collection
  collection(name, MongooseModel) {
    const self = this;
    return {
      async find(query = {}, sortOptions = null) {
        if (isConnected() && MongooseModel) {
          let q = MongooseModel.find(query);
          if (sortOptions) q = q.sort(sortOptions);
          return await q.exec();
        }
        const db = self.read();
        let items = db[name] || [];
        
        // Basic filtering
        items = items.filter(item => {
          for (let key in query) {
            if (query[key] !== undefined) {
              if (key === 'isEnabled' && query[key] === true) {
                if (item[key] === false) return false;
              } else if (item[key] !== query[key]) {
                return false;
              }
            }
          }
          return true;
        });

        // Basic sorting
        if (sortOptions) {
          const key = Object.keys(sortOptions)[0];
          const dir = sortOptions[key] === -1 ? -1 : 1;
          items.sort((a, b) => {
            if (a[key] < b[key]) return -1 * dir;
            if (a[key] > b[key]) return 1 * dir;
            return 0;
          });
        }
        return items;
      },

      async findOne(query = {}) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.findOne(query).exec();
        }
        const db = self.read();
        const items = db[name] || [];
        return items.find(item => {
          for (let key in query) {
            if (query[key] !== undefined && String(item[key]) !== String(query[key])) {
              return false;
            }
          }
          return true;
        }) || null;
      },

      async findById(id) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.findById(id).exec();
        }
        const db = self.read();
        const items = db[name] || [];
        return items.find(item => String(item._id) === String(id) || String(item.id) === String(id)) || null;
      },

      async create(doc) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.create(doc);
        }
        const db = self.read();
        if (!db[name]) db[name] = [];
        const newDoc = {
          _id: doc._id || crypto.randomUUID(),
          ...doc,
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db[name].push(newDoc);
        self.write(db);
        return newDoc;
      },

      async insertMany(docs) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.insertMany(docs);
        }
        const db = self.read();
        if (!db[name]) db[name] = [];
        const added = docs.map(doc => ({
          _id: doc._id || crypto.randomUUID(),
          ...doc,
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        db[name].push(...added);
        self.write(db);
        return added;
      },

      async findByIdAndUpdate(id, updates, options = {}) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.findByIdAndUpdate(id, updates, { new: true, ...options }).exec();
        }
        const db = self.read();
        const items = db[name] || [];
        const index = items.findIndex(item => String(item._id) === String(id) || String(item.id) === String(id));
        if (index === -1) return null;

        const updatedDoc = {
          ...items[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        items[index] = updatedDoc;
        db[name] = items;
        self.write(db);
        return updatedDoc;
      },

      async findOneAndUpdate(query, updates, options = {}) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.findOneAndUpdate(query, updates, { new: true, ...options }).exec();
        }
        const db = self.read();
        const items = db[name] || [];
        const index = items.findIndex(item => {
          for (let key in query) {
            if (query[key] !== undefined && String(item[key]) !== String(query[key])) {
              return false;
            }
          }
          return true;
        });
        if (index === -1) return null;

        const updatedDoc = {
          ...items[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        items[index] = updatedDoc;
        db[name] = items;
        self.write(db);
        return updatedDoc;
      },

      async findByIdAndDelete(id) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.findByIdAndDelete(id).exec();
        }
        const db = self.read();
        const items = db[name] || [];
        const index = items.findIndex(item => String(item._id) === String(id) || String(item.id) === String(id));
        if (index === -1) return null;
        const deleted = items.splice(index, 1)[0];
        db[name] = items;
        self.write(db);
        return deleted;
      },

      async deleteMany(query = {}) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.deleteMany(query).exec();
        }
        const db = self.read();
        if (Object.keys(query).length === 0) {
          const count = (db[name] || []).length;
          db[name] = [];
          self.write(db);
          return { deletedCount: count };
        }
        const items = db[name] || [];
        const remaining = items.filter(item => {
          for (let key in query) {
            if (query[key] !== undefined && item[key] === query[key]) {
              return false;
            }
          }
          return true;
        });
        const deletedCount = items.length - remaining.length;
        db[name] = remaining;
        self.write(db);
        return { deletedCount };
      },

      async countDocuments(query = {}) {
        if (isConnected() && MongooseModel) {
          return await MongooseModel.countDocuments(query).exec();
        }
        const items = await this.find(query);
        return items.length;
      }
    };
  }
}

const store = new StoreManager();
module.exports = store;

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const CHECKPOINTS_DIR = path.join(__dirname, '../../checkpoints');

// Ensure checkpoints directory exists
async function ensureCheckpointsDir() {
  try {
    await fs.access(CHECKPOINTS_DIR);
  } catch {
    await fs.mkdir(CHECKPOINTS_DIR, { recursive: true });
  }
}

// Save checkpoint data
async function saveCheckpoint(data) {
  try {
    await ensureCheckpointsDir();
    
    const checkpointId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const checkpointData = {
      id: checkpointId,
      timestamp: timestamp,
      ...data
    };
    
    const filename = `${checkpointId}.checkpoint.json`;
    const filepath = path.join(CHECKPOINTS_DIR, filename);
    
    await fs.writeFile(filepath, JSON.stringify(checkpointData, null, 2));
    
    console.log(`✓ Checkpoint saved: ${filename}`);
    return checkpointId;
    
  } catch (error) {
    console.error('Error saving checkpoint:', error);
    throw error;
  }
}

// Load checkpoint data
async function loadCheckpoint(checkpointId) {
  try {
    const filepath = path.join(CHECKPOINTS_DIR, `${checkpointId}.checkpoint.json`);
    const content = await fs.readFile(filepath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading checkpoint:', error);
    throw error;
  }
}

// List all checkpoints
async function listCheckpoints() {
  try {
    await ensureCheckpointsDir();
    
    const files = await fs.readdir(CHECKPOINTS_DIR);
    const checkpointFiles = files.filter(file => file.endsWith('.checkpoint.json'));
    
    const checkpoints = [];
    for (const file of checkpointFiles) {
      try {
        const filepath = path.join(CHECKPOINTS_DIR, file);
        const stats = await fs.stat(filepath);
        const content = await fs.readFile(filepath, 'utf8');
        const data = JSON.parse(content);
        
        checkpoints.push({
          id: data.id || file.replace('.checkpoint.json', ''),
          filename: file,
          timestamp: data.timestamp || stats.mtime.toISOString(),
          size: stats.size
        });
      } catch (error) {
        console.error(`Error reading checkpoint ${file}:`, error);
      }
    }
    
    return checkpoints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
  } catch (error) {
    console.error('Error listing checkpoints:', error);
    throw error;
  }
}

// Delete checkpoint
async function deleteCheckpoint(checkpointId) {
  try {
    const filepath = path.join(CHECKPOINTS_DIR, `${checkpointId}.checkpoint.json`);
    await fs.unlink(filepath);
    console.log(`✓ Checkpoint deleted: ${checkpointId}`);
  } catch (error) {
    console.error('Error deleting checkpoint:', error);
    throw error;
  }
}

// Middleware function to automatically save checkpoints
function checkpointMiddleware(req, res, next) {
  // Store original res.json function
  const originalJson = res.json;
  
  // Override res.json to capture response data
  res.json = function(data) {
    // Save checkpoint if this is an assessment request
    if (req.path === '/api/assess' && req.method === 'POST' && data.success) {
      saveCheckpoint({
        type: 'assessment',
        request: {
          body: req.body,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        },
        response: data
      }).catch(error => {
        console.error('Failed to save checkpoint:', error);
      });
    }
    
    // Call original json function
    return originalJson.call(this, data);
  };
  
  next();
}

module.exports = {
  saveCheckpoint,
  loadCheckpoint,
  listCheckpoints,
  deleteCheckpoint,
  checkpointMiddleware
};

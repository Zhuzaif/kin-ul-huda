import express from 'express';
import cors from 'cors';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin with the provided service account
const serviceAccountPath = './firebase-service-account.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

const JOBS_FILE = join(__dirname, 'jobs.json');

// Ensure jobs file exists
if (!existsSync(JOBS_FILE)) {
  writeFileSync(JOBS_FILE, JSON.stringify([]));
}

function getJobs() {
  try {
    return JSON.parse(readFileSync(JOBS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveJobs(jobs) {
  writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
}

// Helper to construct FCM payload
const buildMessage = (options) => {
  const { title, body, imageUrl, customData, conversionEvent, ttl, channelId, sound } = options;
  
  const mergedData = { ...customData };
  if (conversionEvent && conversionEvent !== 'none') {
    mergedData.conversion_event = conversionEvent;
  }

  const message = {
    notification: { title, body },
    data: Object.keys(mergedData).length > 0 ? mergedData : undefined,
    android: {
      notification: {
        sound: sound === 'default' ? 'default' : undefined,
        channelId: channelId || undefined
      }
    },
    apns: {
      payload: {
        aps: {
          'mutable-content': 1,
          sound: sound === 'default' ? 'default' : undefined
        }
      },
      fcm_options: {}
    }
  };
  
  if (ttl) {
    message.android.ttl = ttl * 1000; // milliseconds
    message.apns.headers = {
      'apns-expiration': Math.floor(Date.now() / 1000) + ttl
    };
  }
  
  if (imageUrl) {
    message.notification.imageUrl = imageUrl;
    message.android.notification.imageUrl = imageUrl;
    message.apns.fcm_options.image = imageUrl;
  }
  
  // Cleanup undefined fields
  if (!message.data) delete message.data;
  
  return message;
};

async function executeJob(job) {
  try {
    const message = buildMessage(job.payload);
    message.tokens = job.tokens;
    
    console.log(`Executing scheduled job ${job.id} for ${job.tokens.length} users.`);
    const response = await getMessaging().sendEachForMulticast(message);
    console.log(`Job ${job.id} complete: ${response.successCount} success, ${response.failureCount} failed.`);
  } catch (error) {
    console.error(`Failed to execute job ${job.id}:`, error);
  }
}

// Polling loop for scheduled jobs (runs every 60 seconds)
setInterval(() => {
  const now = new Date().getTime();
  const jobs = getJobs();
  
  const dueJobs = jobs.filter(j => new Date(j.scheduledTime).getTime() <= now);
  const futureJobs = jobs.filter(j => new Date(j.scheduledTime).getTime() > now);
  
  if (dueJobs.length > 0) {
    saveJobs(futureJobs); // Update file immediately to prevent duplicate runs
    for (const job of dueJobs) {
      executeJob(job);
    }
  }
}, 60 * 1000);

// Endpoint to broadcast notifications (multiple tokens)
app.post('/api/broadcast', async (req, res) => {
  const { tokens, scheduledTime, payload } = req.body;

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res.status(400).json({ error: 'No tokens provided.' });
  }
  if (!payload || !payload.title || !payload.body) {
    return res.status(400).json({ error: 'Title and body are required.' });
  }

  // If scheduled for the future
  if (scheduledTime && new Date(scheduledTime).getTime() > new Date().getTime()) {
    const jobs = getJobs();
    const newJob = {
      id: Date.now().toString(),
      scheduledTime,
      tokens,
      payload
    };
    jobs.push(newJob);
    saveJobs(jobs);
    return res.status(200).json({ success: true, message: 'Job scheduled successfully', jobId: newJob.id });
  }

  // Send immediately
  const message = buildMessage(payload);
  message.tokens = tokens;

  try {
    const response = await getMessaging().sendEachForMulticast(message);
    if (response.failureCount > 0) {
      console.error('FCM Failures:', response.responses.filter(r => !r.success).map(r => r.error));
    }
    res.status(200).json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ error: 'Failed to send broadcast.' });
  }
});

// Endpoint to send direct notification (single token)
app.post('/api/send-direct', async (req, res) => {
  const { token, title, body, image, data } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
  }
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required.' });
  }

  const payload = { title, body, imageUrl: image, customData: data };
  const message = buildMessage(payload);
  message.token = token; // required for send

  try {
    const response = await getMessaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending direct message:', error);
    res.status(500).json({ error: 'Failed to send direct message.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`FCM Notification server running on port ${PORT}`);
  console.log(`Scheduler checking every 60 seconds.`);
});

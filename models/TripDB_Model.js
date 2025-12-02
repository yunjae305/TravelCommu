import { nanoid } from 'nanoid';
import db from '../config/firebase.js';

const tripsRef = db.ref('trips');
const requestsRef = db.ref('tripRequests');

function normalizeTrip(id, data) {
  if (!data) return null;
  return {
    id,
    topic: data.topic || data.title,
    destination: data.destination || data.country,
    places: Array.isArray(data.places)
      ? data.places
      : (data.places || '')
          .toString()
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    headcount: Number(data.headcount) || 0,
    budget: data.budget || '예산 미정',
    authorName: data.authorName || data.author || '익명',
    authorEmail: data.authorEmail || '',
    description: data.description || '',
    createdAt: new Date(data.createdAt || Date.now())
  };
}

export async function getAll() {
  const snapshot = await tripsRef.once('value');
  const value = snapshot.val() || {};
  const list = Object.entries(value).map(([tripId, data]) => normalizeTrip(tripId, data));
  return list
    .filter(Boolean)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function create(data) {
  const id = nanoid(8);
  const rawTrip = {
    topic: data.topic,
    destination: data.destination,
    places: data.places,
    headcount: data.headcount,
    budget: data.budget,
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    description: data.description,
    createdAt: Date.now()
  };
  await tripsRef.child(id).set(rawTrip);
  return normalizeTrip(id, rawTrip);
}

export async function findById(id) {
  const snapshot = await tripsRef.child(id).once('value');
  return normalizeTrip(id, snapshot.val());
}

export async function addJoinRequest(tripId, payload) {
  const id = nanoid(8);
  const request = {
    tripId,
    requesterName: payload.requesterName || '익명',
    requesterEmail: payload.requesterEmail || '',
    message: payload.message || '',
    createdAt: Date.now()
  };
  await requestsRef.child(tripId).child(id).set(request);
  return { id, ...request };
}

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Lead } from '../types';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
const databaseId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'leads', '_healthcheck_connection_test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase em modo offline.');
    }
  }
}
testConnection();

const LEADS_COLLECTION = 'leads';

/**
 * Saves or updates a lead directly in the Cloud Firestore database
 */
export async function saveLeadToCloud(lead: Lead): Promise<boolean> {
  try {
    const leadDocRef = doc(db, LEADS_COLLECTION, lead.id);
    const cleanLead: Record<string, unknown> = {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      serviceType: lead.serviceType,
      city: lead.city || 'São Paulo - SP',
      createdAt: lead.createdAt,
      status: lead.status || 'novo',
    };
    if (lead.notes) {
      cleanLead.notes = lead.notes;
    }

    await setDoc(leadDocRef, cleanLead, { merge: true });
    return true;
  } catch (err: unknown) {
    handleFirestoreError(err, OperationType.WRITE, `${LEADS_COLLECTION}/${lead.id}`);
    return false;
  }
}

/**
 * Deletes a lead from the Cloud Firestore database
 */
export async function deleteLeadFromCloud(leadId: string): Promise<boolean> {
  try {
    const leadDocRef = doc(db, LEADS_COLLECTION, leadId);
    await deleteDoc(leadDocRef);
    return true;
  } catch (err: unknown) {
    handleFirestoreError(err, OperationType.DELETE, `${LEADS_COLLECTION}/${leadId}`);
    return false;
  }
}

/**
 * Subscribes to real-time leads from the Cloud Firestore database
 * Whenever ANY person on ANY device types their name and phone, all connected devices update automatically!
 */
export function subscribeToCloudLeads(onLeadsUpdated: (leads: Lead[]) => void) {
  const leadsQuery = query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    leadsQuery,
    (snapshot) => {
      const cloudLeads: Lead[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Lead;
        cloudLeads.push(data);
      });
      onLeadsUpdated(cloudLeads);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, LEADS_COLLECTION);
    }
  );
}

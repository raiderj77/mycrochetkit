// src/services/patternService.ts
// MyCrochetKit Pattern Library - Firestore CRUD Operations

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  Pattern,
  PatternFormData,
  PatternVersion,
  PatternType,
  Difficulty,
  PatternProgress,
  StepAnnotation,
  ProjectPatternFields,
} from '../types/pattern';

// ─── Collection References ───────────────────────────────

const getUserPatternsRef = (uid: string) => collection(db, 'users', uid, 'patterns');

const getPatternDocRef = (uid: string, patternId: string) =>
  doc(db, 'users', uid, 'patterns', patternId);

const getPatternVersionsRef = (uid: string, patternId: string) =>
  collection(db, 'users', uid, 'patterns', patternId, 'versions');

const getProjectDocRef = (uid: string, projectId: string) =>
  doc(db, 'users', uid, 'projects', projectId);

// ─── Firestore → Pattern converter ──────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Firestore DocumentData has no typed shape
function firestoreToPattern(id: string, data: Record<string, any>): Pattern {
  return {
    id,
    name: data.name ?? '',
    type: data.type ?? 'other',
    difficulty: data.difficulty ?? undefined,
    hookSize: data.hookSize ?? undefined,
    yarnWeight: data.yarnWeight ?? undefined,
    gaugeNotes: data.gaugeNotes ?? undefined,
    materials: data.materials ?? [],
    tags: data.tags ?? [],
    source: data.source ?? { type: 'link' },
    rights: data.rights ?? undefined,
    sections: data.sections ?? [],
    abbreviations: data.abbreviations ?? {},
    finishedSize: data.finishedSize ?? undefined,
    estimatedTime: data.estimatedTime ?? undefined,
    notes: data.notes ?? undefined,
    isGenerated: data.isGenerated ?? false,
    generationPrompt: data.generationPrompt ?? undefined,
    createdAt:
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt:
      data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
  };
}

// ─── CREATE ──────────────────────────────────────────────

export async function createPattern(uid: string, formData: PatternFormData): Promise<Pattern> {
  const patternsRef = getUserPatternsRef(uid);

  const docData = {
    ...formData,
    isGenerated: formData.source.type === 'generated',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(patternsRef, docData);
  const snapshot = await getDoc(docRef);
  return firestoreToPattern(docRef.id, snapshot.data()!);
}

// ─── READ (single) ──────────────────────────────────────

export async function getPattern(uid: string, patternId: string): Promise<Pattern | null> {
  const docRef = getPatternDocRef(uid, patternId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;
  return firestoreToPattern(snapshot.id, snapshot.data());
}

// ─── READ (all with optional filters) ───────────────────

export interface PatternFilters {
  type?: PatternType;
  difficulty?: Difficulty;
  tag?: string;
  searchQuery?: string;
}

export async function getPatterns(uid: string, filters?: PatternFilters): Promise<Pattern[]> {
  const patternsRef = getUserPatternsRef(uid);
  let q = query(patternsRef, orderBy('updatedAt', 'desc'));

  if (filters?.type) {
    q = query(patternsRef, where('type', '==', filters.type), orderBy('updatedAt', 'desc'));
  }

  if (filters?.difficulty) {
    if (filters?.type) {
      q = query(
        patternsRef,
        where('type', '==', filters.type),
        where('difficulty', '==', filters.difficulty),
        orderBy('updatedAt', 'desc')
      );
    } else {
      q = query(
        patternsRef,
        where('difficulty', '==', filters.difficulty),
        orderBy('updatedAt', 'desc')
      );
    }
  }

  const snapshot = await getDocs(q);
  let patterns = snapshot.docs.map((doc) => firestoreToPattern(doc.id, doc.data()));

  if (filters?.tag) {
    patterns = patterns.filter((p) => p.tags.includes(filters.tag!));
  }

  if (filters?.searchQuery) {
    const search = filters.searchQuery.toLowerCase();
    patterns = patterns.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  return patterns;
}

// ─── UPDATE ──────────────────────────────────────────────

export async function updatePattern(
  uid: string,
  patternId: string,
  updates: Partial<PatternFormData>,
  saveVersion: boolean = false
): Promise<void> {
  const docRef = getPatternDocRef(uid, patternId);

  if (saveVersion && updates.sections) {
    const existing = await getPattern(uid, patternId);
    if (existing && existing.sections.length > 0) {
      await savePatternVersion(uid, patternId, existing);
    }
  }

  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ─── DELETE ──────────────────────────────────────────────

export async function deletePattern(uid: string, patternId: string): Promise<void> {
  const versionsRef = getPatternVersionsRef(uid, patternId);
  const versionsSnapshot = await getDocs(versionsRef);

  const batch = writeBatch(db);
  versionsSnapshot.docs.forEach((vDoc) => {
    batch.delete(vDoc.ref);
  });

  batch.delete(getPatternDocRef(uid, patternId));

  await batch.commit();
}

// ─── DUPLICATE ───────────────────────────────────────────

export async function duplicatePattern(uid: string, patternId: string): Promise<Pattern> {
  const original = await getPattern(uid, patternId);
  if (!original) throw new Error('Pattern not found');

  const formData: PatternFormData = {
    name: `${original.name} (copy)`,
    type: original.type,
    difficulty: original.difficulty,
    hookSize: original.hookSize,
    yarnWeight: original.yarnWeight,
    gaugeNotes: original.gaugeNotes,
    materials: [...original.materials],
    tags: [...original.tags],
    source: { ...original.source },
    rights: original.rights,
    sections: JSON.parse(JSON.stringify(original.sections)),
    abbreviations: { ...original.abbreviations },
    finishedSize: original.finishedSize,
    estimatedTime: original.estimatedTime,
    notes: original.notes,
  };

  return createPattern(uid, formData);
}

// ─── VERSION HISTORY ─────────────────────────────────────

async function savePatternVersion(
  uid: string,
  patternId: string,
  pattern: Pattern,
  changeDescription?: string
): Promise<void> {
  const versionsRef = getPatternVersionsRef(uid, patternId);

  const existingVersions = await getDocs(query(versionsRef, orderBy('savedAt', 'desc')));

  if (existingVersions.docs.length >= 10) {
    const oldest = existingVersions.docs[existingVersions.docs.length - 1];
    await deleteDoc(oldest.ref);
  }

  await addDoc(versionsRef, {
    patternId,
    sections: pattern.sections,
    abbreviations: pattern.abbreviations,
    notes: pattern.notes,
    savedAt: serverTimestamp(),
    changeDescription: changeDescription ?? 'Auto-saved before edit',
  });
}

export async function getPatternVersions(
  uid: string,
  patternId: string
): Promise<PatternVersion[]> {
  const versionsRef = getPatternVersionsRef(uid, patternId);
  const snapshot = await getDocs(query(versionsRef, orderBy('savedAt', 'desc')));

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      patternId: data.patternId,
      sections: data.sections ?? [],
      abbreviations: data.abbreviations ?? {},
      notes: data.notes,
      savedAt: data.savedAt instanceof Timestamp ? data.savedAt.toDate() : new Date(data.savedAt),
      changeDescription: data.changeDescription,
    };
  });
}

export async function restorePatternVersion(
  uid: string,
  patternId: string,
  versionId: string
): Promise<void> {
  const current = await getPattern(uid, patternId);
  if (current) {
    await savePatternVersion(uid, patternId, current, 'Auto-saved before restore');
  }

  const versionRef = doc(db, 'users', uid, 'patterns', patternId, 'versions', versionId);
  const versionSnapshot = await getDoc(versionRef);
  if (!versionSnapshot.exists()) throw new Error('Version not found');

  const versionData = versionSnapshot.data();

  await updatePattern(uid, patternId, {
    sections: versionData.sections,
    abbreviations: versionData.abbreviations,
    notes: versionData.notes,
  });
}

// ─── PROJECT-PATTERN LINKING ─────────────────────────────

export async function linkPatternToProject(
  uid: string,
  projectId: string,
  patternId: string
): Promise<void> {
  const pattern = await getPattern(uid, patternId);
  if (!pattern) throw new Error('Pattern not found');

  const projectRef = getProjectDocRef(uid, projectId);

  const patternFields: ProjectPatternFields = {
    patternId,
    patternProgress: {
      currentSectionIndex: 0,
      currentStepIndex: 0,
      completedSections: [],
      sectionRepeatCounts: {},
    },
    stepAnnotations: {},
    sectionNotes: {},
  };

  await updateDoc(projectRef, {
    ...patternFields,
    updatedAt: serverTimestamp(),
  });
}

export async function unlinkPatternFromProject(uid: string, projectId: string): Promise<void> {
  const projectRef = getProjectDocRef(uid, projectId);

  await updateDoc(projectRef, {
    patternId: null,
    patternProgress: null,
    updatedAt: serverTimestamp(),
  });
}

// ─── PROGRESS TRACKING ──────────────────────────────────

export async function updatePatternProgress(
  uid: string,
  projectId: string,
  progress: Partial<PatternProgress>
): Promise<void> {
  const projectRef = getProjectDocRef(uid, projectId);

  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (progress.currentSectionIndex !== undefined) {
    updates['patternProgress.currentSectionIndex'] = progress.currentSectionIndex;
  }
  if (progress.currentStepIndex !== undefined) {
    updates['patternProgress.currentStepIndex'] = progress.currentStepIndex;
  }
  if (progress.completedSections !== undefined) {
    updates['patternProgress.completedSections'] = progress.completedSections;
  }
  if (progress.sectionRepeatCounts !== undefined) {
    updates['patternProgress.sectionRepeatCounts'] = progress.sectionRepeatCounts;
  }

  await updateDoc(projectRef, updates);
}

// ─── STEP ANNOTATIONS ───────────────────────────────────

export async function updateStepAnnotation(
  uid: string,
  projectId: string,
  sectionIndex: number,
  stepIndex: number,
  annotation: Partial<StepAnnotation>
): Promise<void> {
  const projectRef = getProjectDocRef(uid, projectId);
  const key = `${sectionIndex}-${stepIndex}`;

  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (annotation.userNote !== undefined) {
    updates[`stepAnnotations.${key}.userNote`] = annotation.userNote;
  }
  if (annotation.isDifficult !== undefined) {
    updates[`stepAnnotations.${key}.isDifficult`] = annotation.isDifficult;
  }
  if (annotation.modification !== undefined) {
    updates[`stepAnnotations.${key}.modification`] = annotation.modification;
  }
  if (annotation.originalInstruction !== undefined) {
    updates[`stepAnnotations.${key}.originalInstruction`] = annotation.originalInstruction;
  }
  if (annotation.inlineCounters !== undefined) {
    updates[`stepAnnotations.${key}.inlineCounters`] = annotation.inlineCounters;
  }

  await updateDoc(projectRef, updates);
}

export async function updateSectionNote(
  uid: string,
  projectId: string,
  sectionIndex: number,
  note: string
): Promise<void> {
  const projectRef = getProjectDocRef(uid, projectId);

  await updateDoc(projectRef, {
    [`sectionNotes.${sectionIndex}`]: note,
    updatedAt: serverTimestamp(),
  });
}

// ─── IMPORT ANNOTATIONS ─────────────────────────────────

export async function importAnnotations(
  uid: string,
  sourceProjectId: string,
  targetProjectId: string
): Promise<void> {
  const sourceRef = getProjectDocRef(uid, sourceProjectId);
  const sourceSnapshot = await getDoc(sourceRef);

  if (!sourceSnapshot.exists()) throw new Error('Source project not found');

  const sourceData = sourceSnapshot.data();
  const targetRef = getProjectDocRef(uid, targetProjectId);

  await updateDoc(targetRef, {
    stepAnnotations: sourceData.stepAnnotations ?? {},
    sectionNotes: sourceData.sectionNotes ?? {},
    updatedAt: serverTimestamp(),
  });
}

// ─── INLINE COUNTER HELPERS ─────────────────────────────

export function createInlineCounter(
  label: string,
  target: number | null = null,
  resetOnAdvance: boolean = false
) {
  return {
    id: `ic_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    label,
    current: 0,
    target,
    resetOnAdvance,
    voiceEnabled: false,
  };
}

// ─── PATTERN TRACKER DATA (direct on pattern doc) ───────

export async function getPatternTrackerData(
  uid: string,
  patternId: string
): Promise<{
  progress: PatternProgress | null;
  annotations: Record<string, StepAnnotation> | null;
}> {
  const docRef = getPatternDocRef(uid, patternId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return { progress: null, annotations: null };
  const data = snapshot.data();
  return {
    progress: data.patternProgress ?? null,
    annotations: data.stepAnnotations ?? null,
  };
}

export async function savePatternProgressDirect(
  uid: string,
  patternId: string,
  progress: PatternProgress
): Promise<void> {
  const docRef = getPatternDocRef(uid, patternId);
  await updateDoc(docRef, { patternProgress: progress });
}

export async function savePatternAnnotationsDirect(
  uid: string,
  patternId: string,
  annotations: Record<string, StepAnnotation>
): Promise<void> {
  const docRef = getPatternDocRef(uid, patternId);
  await updateDoc(docRef, { stepAnnotations: annotations });
}

// ─── PATTERN COUNT ──────────────────────────────────────

export async function getPatternCount(uid: string): Promise<number> {
  const patternsRef = getUserPatternsRef(uid);
  const snapshot = await getDocs(patternsRef);
  return snapshot.size;
}

export async function getTypedPatternCount(uid: string): Promise<number> {
  const patternsRef = getUserPatternsRef(uid);
  const q = query(patternsRef, where('source.type', 'in', ['typed', 'generated']));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

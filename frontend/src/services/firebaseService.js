// src/services/firebaseService.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

import {
  getDatabase,
  ref,
  set,
  update,
  get
} from "firebase/database";


// ==========================================
//  Firebase 초기화
// ==========================================
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

const provider = new GoogleAuthProvider();

console.log("config check:", firebaseConfig);

// ==========================================
//  공통: 로그인 후 RTDB에 유저 생성 함수
// ==========================================
const createOrUpdateUserInDB = async (user, role, mentorCode = "") => {
  const userRef = ref(db, `users/${user.uid}`);

  // 기존 createdAt 유지
  const existingSnap = await get(userRef);
  const createdAt = existingSnap.exists()
    ? existingSnap.val().createdAt
    : new Date().toISOString();

  // DB 업데이트
  await update(userRef, {
    name: user.displayName || "",
    email: user.email || "",
    profileImage: user.photoURL || "",
    role: role,
    mentorCode: mentorCode,
    createdAt: createdAt,
  });

  return user;
};


// ==========================================
//  🔥 학생 로그인
// ==========================================
export const signInStudent = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  await createOrUpdateUserInDB(user, "student", "");

  return user;
};


// ==========================================
//  🔥 멘토 로그인 (코드 검증 포함)
// ==========================================
const VALID_MENTOR_CODE = "PROFOLIO-1234";

export const signInMentor = async (mentorCode) => {
  if (mentorCode !== VALID_MENTOR_CODE) {
    throw new Error("❌ 멘토 인증코드가 올바르지 않습니다.");
  }

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  await createOrUpdateUserInDB(user, "mentor", mentorCode);

  return user;
};


// ==========================================
//  🔥 수강 신청(학생이 courseId를 듣는 중)
// ==========================================
export const enrollCourse = async (userId, courseId) => {
  await update(ref(db, `users/${userId}/enrolledCourses/${courseId}`), true);
};


// ==========================================
//  로그아웃
// ==========================================
export const logout = () => signOut(auth);


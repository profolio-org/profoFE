// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import CourseDetail from "./components/CourseDetail";
import TeacherCourseEditor from "./components/TeacherCourseEditor";
import PrivateRoute from "./components/PrivateRoute";

import { onAuthStateChanged } from "firebase/auth";
import { logout, db, auth } from "./services/firebaseService";
import { ref, get } from "firebase/database";

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔥 로그인 유지
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snap = await get(userRef);
        const dbUser = snap.exists() ? snap.val() : {};

        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          ...dbUser,
        });
      } else {
        setUser(null);
      }

      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  const handleLoginSuccess = async (loggedUser) => {
    const userRef = ref(db, `users/${loggedUser.uid}`);
    const snap = await get(userRef);
    const dbUser = snap.exists() ? snap.val() : {};

    setUser({
      uid: loggedUser.uid,
      displayName: loggedUser.displayName,
      email: loggedUser.email,
      photoURL: loggedUser.photoURL,
      ...dbUser,
    });
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* 상단 헤더 */}
      <Header
        user={user}
        onLogin={() => (window.location.href = "/login")}
        onLogout={async () => {
          await logout();
          setUser(null);
        }}
      />

      {/* 라우터 */}
      <div className="w-full mx-auto pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />

          <Route
            path="/course/:courseId"
            element={
              <PrivateRoute user={user} authLoading={authLoading}>
                <CourseDetail user={user} />
              </PrivateRoute>
            }
          />

          <Route
            path="/course/:courseId/edit"
            element={
              <PrivateRoute user={user} authLoading={authLoading}>
                <TeacherCourseEditor user={user} />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

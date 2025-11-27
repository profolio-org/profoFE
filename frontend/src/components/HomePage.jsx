// src/pages/HomePage.jsx
import React, { useState } from "react";
import CategoryBar from "../components/CategoryBar";
import CourseList from "../components/CourseList";
import CourseCarousel from "../components/CourseCarousel";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체 카테고리");

  // ⭐ 전체 강의 통합 데이터
  const allCourses = [
    {
      id: 1,
      label: "인기",
      title: "요리 기초 강의",
      description: "스테이크, 칵테일 등 기초 요리 수업",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      category: "요리·음식",
    },
    {
      id: 2,
      label: "인기 급상승",
      title: "홈카페 바리스타 클래스",
      description: "라떼아트 & 핸드드립",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
      category: "요리·음식",
    },
    {
      id: 3,
      label: "인기",
      title: "창업 실전 강의",
      description: "메뉴 개발, 브랜딩, 마케팅 전략",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      category: "창업·브랜딩",
    },
    {
      id: 4,
      label: "추천",
      title: "디지털 드로잉 입문",
      description: "아이패드로 배우는 기초 드로잉",
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b",
      category: "드로잉·일러스트",
    },
    {
      id: 5,
      label: "신규",
      title: "포토샵 디자인 클래스",
      description: "썸네일·SNS 디자인 제작",
      image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
      category: "디지털 디자인",
    },
    {
      id: 6,
      label: "추천",
      title: "디지털 마케팅 기초",
      description: "SNS 운영과 마케팅 전략",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
      category: "마케팅·SNS",
    },
    {
      id: 7,
      label: "신규",
      title: "캘리그라피 기초",
      description: "펜 잡는 법부터 글자 감각까지",
      image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
      category: "드로잉·일러스트",
    }
  ];

  // ⭐ 선택된 카테고리 필터링
  const filteredCourses =
    selectedCategory === "전체 카테고리"
      ? allCourses
      : allCourses.filter((course) => course.category === selectedCategory);

  return (
    <div className="min-h-screen bg-primary text-white">

      {/* 🔥 메인 배너 */}
      <div className="py-10 bg-accent text-accent shadow-md mb-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-primary">리튠 100배 간다! 부의 마지막 기회!</h2>
          <p className="opacity-80 text-primary">문창훈 작가의 리튠 투자 비법</p>
        </div>
      </div>

      {/* 🔥 카테고리 바 */}
      <CategoryBar
        selected={selectedCategory}
        onSelect={(cat) => setSelectedCategory(cat)}
      />

      {/* 🔥 인기 강의 */}
      <div className="max-w-6xl mx-auto px-4 mt-12 text-accent">
        <h2 className="text-xl font-bold mb-4">
          {selectedCategory === "전체 카테고리"
            ? "지금 인기 있는"
            : `${selectedCategory} 인기 강의`}
        </h2>

        <CourseList
          courses={filteredCourses.slice(0, 3)}
          onSelect={(courseId, navigate) => navigate(`/course/${courseId}`)}
        />
      </div>

      {/* 🔥 전체 강의 */}
      <div className="max-w-6xl mx-auto mt-10 px-4 text-accent">
        <h2 className="text-xl font-bold mb-3">
          {selectedCategory === "전체 카테고리"
            ? "전체 강의"
            : `${selectedCategory} 전체 강의`}
        </h2>

        <CourseCarousel courses={filteredCourses} />
      </div>

    </div>
  );
};

export default HomePage;

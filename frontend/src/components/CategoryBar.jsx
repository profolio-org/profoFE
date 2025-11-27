// src/components/CategoryBar.jsx
import React from "react";

const categories = [
  "전체 카테고리",
  "디지털 디자인",
  "드로잉·일러스트",
  "요리·음식",
  "창업·브랜딩",
  "마케팅·SNS",
];

const CategoryBar = ({ selected, onSelect }) => {
  return (
    <div className="bg-primary border-b border-primary/50">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-3 px-4 py-4">

        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => onSelect(cat)}
            className={`
              px-4 py-2 rounded-full shadow-sm whitespace-nowrap transition
              
              ${
                selected === cat
                  ? "bg-accent text-primary font-semibold shadow-lg"
                  : "bg-primary text-accent border border-accent/40 hover:bg-primary/80"
              }
            `}
          >
            {cat}
          </button>
        ))}

      </div>
    </div>
  );
};

export default CategoryBar;

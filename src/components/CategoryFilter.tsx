import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0 0;
  padding: 1.5rem;
  background: rgba(42, 85, 63, 0.8);
  border-block: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

// const FilterLabel = styled.span`
//   color: #d4d4c8;
//   font-size: 1.1rem;
//   font-weight: 500;
//   margin-right: 1.5rem;

//   @media (max-width: 768px) {
//     margin-right: 0;
//     margin-bottom: 0.5rem;
//   }
// `;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #d4d4c8;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #ffffff;
    /* transform: translateY(-1px); */
  }
`;

const Checkbox = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #d4d4c8;
  border-radius: 4px;
  margin-right: 0.4rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    border-width: 1px;
  }

  &:checked {
    background: linear-gradient(135deg, #8b7355, #a0916b);
    border-color: #a0916b;
  }

  &:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  &:hover {
    border-color: #ffffff;
    box-shadow: 0 0 8px rgba(212, 212, 200, 0.3);
  }
`;

const CategoryText = styled.span`
  text-transform: capitalize;
  font-size: 0.9rem;
  color: #ffffff;
`;

const PhotoCount = styled.span`
  margin-left: 0.2rem;
  font-size: 0.8rem;
  opacity: 1;
  color: #b3a279;
`;

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  photoCounts: Record<string, number>;
  totalPhotos: number;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  photoCounts,
  totalPhotos,
}) => {
  const isAllSelected = selectedCategories.length === 0;

  return (
    <FilterContainer>
      {/* <FilterLabel>Filter by Category:</FilterLabel> */}
      <CheckboxGroup>
        <CheckboxItem key="all">
          <Checkbox type="checkbox" checked={isAllSelected} onChange={() => onCategoryChange('all')} />
          <CategoryText>All</CategoryText>
          <PhotoCount>({totalPhotos})</PhotoCount>
        </CheckboxItem>
        {categories.map((category) => (
          <CheckboxItem key={category}>
            <Checkbox
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryChange(category)}
            />
            <CategoryText>{category}</CategoryText>
            <PhotoCount>({photoCounts[category] || 0})</PhotoCount>
          </CheckboxItem>
        ))}
      </CheckboxGroup>
    </FilterContainer>
  );
};

export default CategoryFilter;

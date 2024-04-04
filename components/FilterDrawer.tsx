import { ArrowRepeat, X, FilterRight } from "react-bootstrap-icons";
import Image from "next/image";
import datastaxLogo from "@/assets/datastax-logo.png";
import { CATEGORIES, GENDERS } from "@/utils/consts";

const FilterDrawer = ({
  onClose,
  image,
  setFilters,
  filters,
  isSingleSelect = false,
}) => {
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatOption = (option: string): string => {
    return option.split("_").map(capitalizeFirstLetter).join("/");
  };

  const handleRadioSelect = (option: string, section: string) => {
    setFilters((prev) => ({
      ...prev,
      [section]: [option],
    }));
  };

  const handleMultiSelect = (
    option: string,
    section: string,
    selectedOptions
  ) => {
    if (selectedOptions.includes(option)) {
      setFilters((prev) => ({
        ...prev,
        categories: prev[section].filter((item) => item !== option),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [section]: [...prev[section], option],
      }));
    }
  };

  const handleSelect = (option: string, selection: string, filters) => {
    if (isSingleSelect) {
      handleRadioSelect(option, selection);
    } else {
      handleMultiSelect(option, selection, filters);
    }
  };

  return (
    <div className="fixed top-0 right-0 md:w-[32rem] w-screen h-full shadow-xl transition-transform transform translate-x-0 z-50 cream-background">
      {/* Header */}
      <button
        className="absolute top-4 right-4 p-2 rounded-md"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      <div className="overflow-y-auto" style={{ height: "calc(100% - 5rem)" }}>
        <div className="py-2 mt-4">
          <div className="flex flex-col p-8">
            <div className="py-2">
              <img
                className="w-64 h-64 rounded-3xl mx-auto object-cover"
                src={image}
                alt="user image"
              />
            </div>
            <div className="flex items-center justify-center py-4">
              <button className="flex items-center justify-center bg-black text-white rounded-full px-6 py-4">
                <ArrowRepeat size={20} className="mr-2" />
                Choose a new outfit
              </button>
            </div>

            <div className="flex items-center justify-center pt-4 pb-8 border-b-2">
              Powered by{" "}
              <Image
                className="ml-2"
                src={datastaxLogo}
                alt="DataStax Logo"
                height={16}
                width={172}
              />{" "}
            </div>
            <div className="text-lg pl-4 pb-3 pt-6 mb-6 border-b-2 border-black">
              Gender
            </div>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((gender, index) => (
                <button
                  key={gender}
                  className={`py-3 px-4 rounded-full ${
                    index === GENDERS.length - 1 ? "col-span-2" : ""
                  } ${
                    filters.gender.includes("gender")
                      ? "dark-background"
                      : "bg-white"
                  }`}
                  onClick={() => handleSelect(gender, "gender", filters.gender)}
                >
                  {formatOption(gender)}
                </button>
              ))}
            </div>
            <div className="text-lg pl-4 pb-3 pt-6 mb-6 border-b-2 border-black">
              Categories
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((category, index) => (
                <button
                  key={category}
                  className={`text-black bg-white py-3 px-4 rounded-full ${
                    index === CATEGORIES.length - 1 ? "col-span-2" : ""
                  } ${
                    filters.categories.includes("categories")
                      ? "dark-background"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    handleSelect(category, "categories", filters.categories)
                  }
                >
                  {formatOption(category)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full  border-t-2 pt-4 cream-background">
        <div className="grid grid-cols-2 justify-center gap-4 text-lg sm:px-2">
          <button
            onClick={() => {
              setFilters({
                gender: ["all"],
                categories: [],
              });
            }}
          >
            Clear All
          </button>
          <button className="bg-black text-white text-lg rounded-full flex items-center justify-center bg-black text-white rounded-full px-6 py-4">
            <FilterRight className="mr-2" size={24} />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;

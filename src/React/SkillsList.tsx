import React, { useState } from "react";

const CategoryIcons = {
  "Game Development (Unity / C#)": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-[var(--sec)] opacity-70 flex-shrink-0"
    >
      <path d="M7.5 9C6.11929 9 5 10.1193 5 11.5V12.5C5 13.8807 6.11929 15 7.5 15H8.58579L10.2929 16.7071C10.9229 17.3371 12 16.891 12 16V15H12.5L14.2929 16.7929C14.9229 17.4229 16 16.9768 16 16.0858V15H16.5C17.8807 15 19 13.8807 19 12.5V11.5C19 10.1193 17.8807 9 16.5 9H7.5ZM7.5 7H16.5C18.9853 7 21 9.01472 21 11.5V12.5C21 14.9853 18.9853 17 16.5 17H16V18.0858C16 19.7584 13.9771 20.5966 12.7929 19.4142L11.3787 18H11.2071C10.8095 18 10.4281 17.842 10.1464 17.5607L7.58579 15H7.5C5.01472 15 3 13.9853 3 11.5V11.5C3 9.01472 5.01472 7 7.5 7ZM7.5 11H9.5V13H7.5V11ZM14.5 11H16.5V13H14.5V11Z"></path>
    </svg>
  ),
  "Interactive Systems Dev (p5.js, react)": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-[var(--sec)] opacity-70 flex-shrink-0"
    >
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 11l8-4" />
      <path d="M8 13l8 4" />
    </svg>
  ),
  "SFX Designer (Reaper, FL Studio)": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-[var(--sec)] opacity-70 flex-shrink-0"
    >
      <path d="M3 10V14H7L12 18V6L7 10H3ZM14.5 8.5C15.8807 9.88071 15.8807 12.1193 14.5 13.5L13.0858 12.0858C13.7043 11.4673 13.7043 10.5327 13.0858 9.91421L14.5 8.5ZM17.3284 5.67157C20.4536 8.79678 20.4536 13.2032 17.3284 16.3284L15.9142 14.9142C18.2589 12.5695 18.2589 9.4305 15.9142 7.08579L17.3284 5.67157ZM2 8H7.58579L14 3V21L7.58579 16H2V8Z"></path>
    </svg>
  ),
};

const SkillsList = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const skills = {
    "Game Development (Unity / C#)": [
      "Creation of 2D video games and playable prototypes, focused on mechanics, states, probabilities, and player experience.",
    ],
    "Interactive Systems Dev (p5.js, react)": [
      "Design and development of real-time interactive systems, combining logic, networks, and user experience.",
    ],
    "SFX Designer (Reaper, FL Studio)": [
      "Sound design for games including foley recording and game OST making.",
    ],
  };

  const imageSlotLabels: Record<string, string> = {
    "Game Development (Unity / C#)": "Image slot",
    "Interactive Systems Dev (p5.js, react)":
      "Image slot",
    "SFX Designer (Reaper, FL Studio)": "Image slot",
  };

  const imageSlotSrc: Record<string, string> = {
    "Game Development (Unity / C#)": "/Coding1.jpg",
    "Interactive Systems Dev (p5.js, react)":
      "/FlockingInteractivo.png",
    "SFX Designer (Reaper, FL Studio)": "/TocandoPiano.jpg",
  };

  const toggleItem = (item: string) => {
    setOpenItem(openItem === item ? null : item);
  };

  return (
    <div className="text-left pt-3 md:pt-9">
      <h3 className="text-[var(--white)] text-3xl md:text-4xl font-semibold md:mb-6">
        What I build.
      </h3>
      <ul className="space-y-4 mt-4 text-lg">
        {Object.entries(skills).map(([category, items]) => (
          <li key={category} className="w-full">
            <div
              onClick={() => toggleItem(category)}
              className="md:w-[400px] w-full bg-[#1414149c] rounded-2xl text-left hover:bg-opacity-80 transition-all border border-[var(--white-icon-tr)] cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                {CategoryIcons[category]}
                <div className="flex items-center gap-2 flex-grow justify-between">
                  <div className="min-w-0 max-w-[200px] md:max-w-none overflow-hidden">
                    <span className="block truncate text-[var(--white)] text-lg">
                      {category}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-6 h-6 text-[var(--white)] transform transition-transform flex-shrink-0 ${
                      openItem === category ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                  </svg>
                </div>
              </div>

              <div
                className={`transition-all duration-300 px-4 ${
                  openItem === category
                    ? "max-h-[900px] pb-4 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <ul className="space-y-2 text-[var(--white-icon)] text-sm">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="pl-1">•</span>
                      <li className="pl-3">{item}</li>
                    </div>
                  ))}
                </ul>

                <div className="pt-3">
                  <div className="w-full h-40 md:h-48 rounded-xl border border-[var(--white-icon-tr)] bg-[#101010] overflow-hidden">
                    {imageSlotSrc[category] ? (
                      <img
                        src={imageSlotSrc[category]}
                        alt={category}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[var(--white-icon)] text-xs">
                          {imageSlotLabels[category] ?? "Image slot"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsList;

import React, { useState } from "react";
import { formatDescription } from "../../utilities/Utils";

const ReadMore = ({ children }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  // Ensure children is a string
  const text = typeof children === "string" ? children : "";

  // Slice text and apply formatting
  const formattedText = formatDescription(text);

  return (
    <div className="text">
      <p
        dangerouslySetInnerHTML={{
          __html: isReadMore
            ? formattedText.slice(0, 1000) + (text.length > 1000 ? "..." : "")
            : formattedText,
        }}
      />
      {text.length > 1000 && (
        <span
          onClick={toggleReadMore}
          className="read-or-hide"
          style={{ color: "green", cursor: "pointer" }}
        >
          {isReadMore ? " read more" : " show less"}
        </span>
      )}
    </div>
  );
};

export default ReadMore;

"use client";
import React, { useEffect, useState } from "react";

const TimesAgo = ({ date }: { date: Date }) => {
  const [text, setText] = useState("");
  useEffect(() => {
    // how many minutes passed since that date
    const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60000);

    if (minutes < 1) {
      setText("just now");
    } else if (minutes < 60) {
      setText(`${minutes} minute${minutes > 1 ? "s" : ""} ago`);
    } else if (minutes < 1440) {
      setText(
        `${Math.round(minutes / 60)} hour${Math.round(minutes / 60) > 1 ? "s" : ""} ago`,
      );
    } else
      setText(
        `${Math.round(minutes / 1440)} day${Math.round(minutes / 1440) > 1 ? "s" : ""} ago`,
      );
  }, [date]);
  return <span>{text}</span>;
};

export default TimesAgo;

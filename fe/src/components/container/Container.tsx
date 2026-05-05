import React from "react";

interface CotainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: CotainerProps) => {
  return <div className={`${className}`}>{children}</div>;
};

export default Container;

const Logo = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
    xl: "h-24",
    xxl: "h-32",
  };

  return (
    <img
      src="/tcoefs-logo.png"
      alt="TCoEFS"
      className={`${sizes[size]} w-auto ${className}`}
    />
  );
};

export default Logo;

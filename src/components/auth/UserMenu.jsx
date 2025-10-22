import { useState, useEffect, useRef } from "react";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserMenu = ({ onOpenAuth }) => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getUserName = () => {
    if (!user) return "";
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => (user ? setIsOpen(!isOpen) : onOpenAuth())}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f8fbf9] shadow-[inset_0_2px_4px_rgba(49,104,64,0.15),inset_0_-1px_2px_rgba(255,255,255,0.5)] text-primary/70 hover:text-primary transition-all duration-[180ms] cursor-pointer"
        aria-label={user ? "User menu" : "Sign in"}
      >
        <User size={16} />
        {user && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Dropdown Menu - Only Sign Out - Positioned below pill */}
      {user && isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-12 w-44 bg-white rounded-xl shadow-[0_4px_16px_rgba(49,104,64,0.12)] border border-[#d9e8e0] overflow-hidden z-50 animate-fade-in">
          {/* User Info */}
          <div className="px-3 py-2.5 bg-[#f8fbf9] border-b border-[#d9e8e0]">
            <p className="text-[13px] font-semibold text-primary truncate">
              {getUserName()}
            </p>
            <p className="text-[11px] text-secondary truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2.5 flex items-center gap-2 text-primary hover:bg-sage-light transition-all duration-[180ms] text-left group"
          >
            <LogOut
              size={16}
              className="text-primary/60 group-hover:text-accent transition-colors duration-[180ms]"
            />
            <span className="text-[13px] font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

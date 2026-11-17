import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const NotFound = () => {
  useDocumentMeta("Page not found");
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="container-page py-28 text-center focus:outline-none md:py-36">
        <p className="font-serif text-[96px] font-semibold leading-none text-brand/25 md:text-[160px]">404</p>
        <h1 className="headline mt-2 text-4xl md:text-5xl">This page could not be found</h1>
        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-ink-2">
          The link may be mistyped or the story may have moved. Try the latest stories instead.
        </p>
        <Link to="/" className="btn btn-primary mt-8">
          <ArrowLeft size={16} /> Back to the blog
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;

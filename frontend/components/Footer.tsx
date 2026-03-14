import BrandLogo from "./BrandLogo";

const Footer = () => {
  return (
    <footer className="border-t border-border py-6 px-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <BrandLogo className="size-12 text-primary" />
          <span className="text-2xl mx-1 font-semibold text-primary">
            MLCode
          </span>
        </div>
        <p className="text-md">
          © {new Date().getFullYear()} MLCode. Master machine learning through
          practice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white text-sm font-bold">E</span>
          <div>
            <div className="font-semibold text-slate-900">Estatery</div>
            <p className="text-slate-600">Portal properti untuk buyer & agent.</p>
          </div>
        </div>
        <p>© {new Date().getFullYear()} Estatery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

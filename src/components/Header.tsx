interface HeaderProps {
  onExport: () => void;
}

const Header = ({ onExport }: HeaderProps) => {
  return (
    <header className="header">
      <h1>Map Drawing Tool</h1>
      <button className="btn primary" onClick={onExport}>
        Export GeoJSON
      </button>
    </header>
  );
};

export default Header;

import { useRef, useState } from "react";

const DIRECTIONS = [
  "Ҳуқуқбузарликлар профилактикаси",
  "Жамоат тартибини сақлаш",
  "Йўл ҳаракати хавфсизлиги",
  "Пробация",
  "Қўриқлаш",
  "Тезкор қидирув хизмати",
  "Миллий гвардия",
  "Хотин-қизлар",
  "Ёшлар билан ишлаш",
  "Вояга етмаганлар",
  "Соғлиқни сақлаш",
  "Камбағаликни қисқартириш",
  "Ижтимоий хизматлар маркази",
  "Маҳаллалар уюшмаси",
  "Солиқ",
  "Коммунал соҳалар",
];

const DownloadIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ExcelIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function WorkDoneUploadExcel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDownload = (index: number) => {
    console.log(`Shablon yuklab olish: direction ${index + 1}`);
  };
  return (
    <div>
      <div className="eup-templates">
        <p className="eup-templates__label">Shablon yuklab olish</p>
        <div className="eup-templates__grid">
          {DIRECTIONS.map((name, i) => (
            <button
              key={i}
              className="eup-template-btn"
              onClick={() => handleDownload(i)}
              title={name}
            >
              <span className="eup-template-btn__icon">
                <ExcelIcon />
              </span>
              <span className="eup-template-btn__num">{i + 1}</span>
              <span className="eup-template-btn__name">{name}</span>
              <span className="eup-template-btn__dl">
                <DownloadIcon />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div
        className={`mb-4 eup-dropzone${dragging ? " eup-dropzone--active" : ""}${selectedFile ? " eup-dropzone--selected" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="eup-dropzone__input"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="eup-dropzone__icon">
          <UploadIcon />
        </div>
        {selectedFile ? (
          <p className="eup-dropzone__text eup-dropzone__text--file">
            {selectedFile.name}
          </p>
        ) : (
          <>
            <p className="eup-dropzone__text">Excel faylni bu yerga tashlang</p>
            <p className="eup-dropzone__hint">
              yoki bosib tanlang (.xlsx, .xls)
            </p>
          </>
        )}
      </div>
    </div>
  );
}

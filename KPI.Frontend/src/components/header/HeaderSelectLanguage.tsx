import React, { useState } from "react";
import { CustomSelect } from "../form/SelectField";
import GlobeIcon from "../icons/GlobeIcon"; // GlobeIcon ni import qilish
import "./assets/header_select.scss";

interface Language {
    value: 'uz-lotin' | 'uz-kiril';
    label: string;
}

const languages: Language[] = [
    {
        value: 'uz-kiril',
        label: 'Ўз'
    },
    {
        value: 'uz-lotin',
        label: "O'z"
    }
];

const HeaderSelectLanguage: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('uz-kiril');

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
        console.log('Til tanlandi:', event.target.value);
    };

    return (
        <div className="header_select_language_wrapper">
            <CustomSelect
                options={languages}
                value={selectedLanguage}
                onChange={handleLanguageChange}
                containerClass="header-language-select"
                icon={
                    <GlobeIcon className="header-language-icon" />
                }
            />
        </div>
    );
};

export default HeaderSelectLanguage;
import "./assets/header_input.scss";

import SearchIcon from "../icons/SearchIcon";

export default function HeaderInput() {
  return (
    <div className="header_input_wrapper">
      <SearchIcon size={30} />
      <input className="header_input" type="text" />
    </div>
  );
}

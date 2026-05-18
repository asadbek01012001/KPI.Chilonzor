import LeftIcon from "../icons/LeftIcon";
import RightIcon from "../icons/RightIcon";

import "./assets/full_thead_button.scss";

interface Props {
  readonly value: boolean;
  readonly setValue: () => void;
}

export default function FullTHeadButton({ setValue, value }: Props) {
  return (
    <button className="full_thead_button" onClick={setValue}>
      {Boolean(value) && <LeftIcon />}
      {!Boolean(value) && <RightIcon />}
    </button>
  );
}

import BottomIcon from "../icons/BottomIcon";
import TopIcon from "../icons/TopIcon";

import "./assets/full_tbody_button.scss";

interface Props {
  readonly value: boolean;
  readonly setValue: () => void;
}

export default function FullTBodyButton({ setValue, value }: Props) {
  return (
    <button className="full_tbody_button" onClick={setValue}>
      {Boolean(value) && <TopIcon />}
      {!Boolean(value) && <BottomIcon />}
    </button>
  );
}

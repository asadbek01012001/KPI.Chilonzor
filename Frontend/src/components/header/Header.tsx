import HeaderActions from "./HeaderActions";
import HeaderDateTimeResources from "./HeaderDateTimeResources";
import HeaderProfile from "./HeaderProfile";
import HeaderWrapper from "./HeaderWrapper";

export default function Header() {
  return (
    <HeaderWrapper>
      <HeaderProfile />
      <HeaderDateTimeResources />
      <HeaderActions />
    </HeaderWrapper>
  );
}

interface Props {
  readonly size?: number | string | undefined;
  readonly color?: string;
}

export default function NationalGuardIcon({
  size = 30,
  color = "white",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_27_2783"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="30"
        height="30"
      >
        <path d="M0 1.90735e-06H30V30H0V1.90735e-06Z" fill="white" />
      </mask>
      <g mask="url(#mask0_27_2783)">
        <path
          d="M15 1.17188L3.51562 5.94006V11.7364C3.51562 19.2379 8.05482 25.9934 15 28.8281C21.9451 25.9934 26.4844 19.2379 26.4844 11.7364V5.94006L15 1.17188Z"
          stroke="#2473BD"
          strokeWidth={2}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.4297 14.0687L13.7047 17.3438L19.5703 11.4782"
          stroke="#2473BD"
          strokeWidth={2}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

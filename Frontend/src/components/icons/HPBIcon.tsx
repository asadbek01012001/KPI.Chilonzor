interface Props {
  readonly size?: number | string | undefined;
  readonly color?: string;
}

export default function HPBIcon({ size = 30, color = "white" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_27_4818"
        maskUnits="userSpaceOnUse"
        x="1"
        y="1"
        width="28"
        height="28"
      >
        <path d="M1 0.999998H29V29H1V0.999998Z" fill="white" />
      </mask>
      <g mask="url(#mask0_27_4818)">
        <path
          d="M15 24.4253C17.1914 22.6104 19.9476 21.6173 22.793 21.6173H28.1797V21.6078V8.59222H22.793C19.9476 8.59222 17.1914 9.58535 15 11.4002C12.8086 9.58535 10.0524 8.59222 7.20698 8.59222H1.82031V21.6078V21.6173H7.20698C10.0524 21.6173 12.8086 22.6104 15 24.4253Z"
          stroke="#2473BD"
          strokeMiterlimit={10}
        />
        <path
          d="M28.1797 21.6172V24.8984H1.82031V21.6172"
          stroke="#2473BD"
          strokeMiterlimit={10}
        />
        <path
          d="M28.1797 24.9079V28.1797H1.82031V24.9079"
          stroke="#2473BD"
          strokeMiterlimit={10}
        />
        <path d="M15 11.4001V24.8438" stroke="#2473BD" strokeMiterlimit={10} />
        <path
          d="M15 7.78125C17.7655 6.12373 17.7093 3.44623 17.7093 3.44623C16.2042 3.44623 15 2.20312 15 2.20312C15 2.20312 13.7959 3.44623 12.2907 3.44623C12.2907 3.44623 12.2346 6.12373 15 7.78125Z"
          stroke="#2473BD"
          strokeMiterlimit={10}
        />
        <path
          d="M11.7734 13.9922C10.3325 13.4116 8.78356 13.1061 7.20698 13.1061H5.04688"
          stroke="#2473BD"
          strokeMiterlimit={10}
        />
        <path
          d="M5.04688 17.2781H7.20698C8.78356 17.2781 10.3325 17.5834 11.7734 18.1641"
          stroke="#2473BD"
          strokeMiterlimit={10}
        />
        <path
          d="M18.2266 13.9922C19.6675 13.4116 21.2164 13.1061 22.793 13.1061H24.9531"
          stroke="#2473BD"
          strokeMiterlimit={10}
        />
        <path
          d="M24.9531 17.2781H22.793C21.2164 17.2781 19.6675 17.5834 18.2265 18.1641"
          stroke="#2473BD"
          strokeMiterlimit={10}
        />
      </g>
    </svg>
  );
}

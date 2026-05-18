interface Props {
  readonly size?: number | string;
  readonly color?: string;
}

export default function SocialServiceIcon({
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
      <g clipPath="url(#clip0_27_2868)">
        <mask
          id="mask0_27_2868"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={30}
          height={30}
        >
          <path d="M0 0H30V30H0V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_27_2868)">
          <path
            d="M11.4844 29.1211V4.45313H22.0898V29.1211"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.2422 4.45312V0.878906H20.2734V4.45312"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.4844 8.02734H6.15234V29.1211"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.15234 16.8164L2.63672 18.5742V29.1211"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22.0898 13.3008L27.3633 15.0586V29.1211"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0.878906 29.1211H29.1211"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <path
          d="M15 22.0898H18.5156"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 18.5742H18.5156"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 15.0586H18.5156"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 11.543H18.5156"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 8.02734H18.5156"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <mask
          id="mask1_27_2868"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={30}
          height={30}
        >
          <path d="M0 0H30V30H0V0Z" fill="white" />
        </mask>
        <g mask="url(#mask1_27_2868)">
          <path
            d="M25.6055 22.0898H27.3633"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M25.6055 18.5742H27.3633"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M25.6055 25.6055H27.3633"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <path
          d="M7.91015 25.6055H6.15234"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.91015 22.0898H6.15234"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.91015 18.5742H6.15234"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.91015 15.0586H6.15234"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.91015 11.543H6.15234"
          stroke="#2473BD"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <mask
          id="mask2_27_2868"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={30}
          height={30}
        >
          <path d="M0 0H30V30H0V0Z" fill="white" />
        </mask>
        <g mask="url(#mask2_27_2868)">
          <path
            d="M18.5156 29.1211V25.6055H15V29.1211"
            stroke="#2473BD"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_27_2868">
          <rect width={30} height={30} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

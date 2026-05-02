interface Props {
  readonly size?: number | string;
  readonly color?: string;
}

export default function TQHIcon({ size = 30, color = "white" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.3719 24.8467H5.81821C4.61272 24.8467 3.63543 25.824 3.63543 27.0295V28.1209H26.5547V27.0295C26.5547 25.824 25.5774 24.8467 24.3719 24.8467Z"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.1891 21.5728H8.001C6.7955 21.5728 5.81821 22.55 5.81821 23.7555V24.8469H24.3719V23.7555C24.3719 22.55 23.3946 21.5728 22.1891 21.5728Z"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.095 7.27539C11.4785 7.27539 8.54669 10.2072 8.54669 13.8237V21.5726H21.6434V13.8237C21.6434 10.2072 18.7116 7.27539 15.095 7.27539Z"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.095 4.00114V1.81836"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.9175 13.8237H27.1002"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.08973 13.8237H5.27252"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.6015 8.91268L25.4919 7.82129"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.0063 5.3171L21.0977 3.42676"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1838 5.3171L9.09239 3.42676"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.58852 8.91268L4.69817 7.82129"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.095 10.5498V14.9154"
        stroke="#2473BD"
        strokeWidth={1.6}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

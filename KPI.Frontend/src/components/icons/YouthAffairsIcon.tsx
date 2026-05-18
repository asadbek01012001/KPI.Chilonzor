interface Props {
  readonly size?: number | string;
  readonly color?: string;
}

export default function YouthAffairsIcon({
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
        id="mask0_27_2802"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="30"
        height="30"
      >
        <path d="M0 0H30V30H0V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_27_2802)">
        <path
          d="M17.3437 20.2148H19.6875C23.5707 20.2148 26.7187 23.3629 26.7187 27.2461V29.1211H3.28125V27.2461C3.28125 23.3629 6.42926 20.2148 10.3125 20.2148H12.6562"
          stroke="#2473BD"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 17.8711C12.0875 17.8711 9.72656 15.5101 9.72656 12.5977V9.08203C10.8826 9.08203 12.0227 8.81285 13.0566 8.29594L13.6379 8.00525C15.851 6.89871 18.5239 7.33248 20.2734 9.08203V12.5977C20.2734 15.5101 17.9125 17.8711 15 17.8711Z"
          stroke="#2473BD"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.72656 9.08203C7.46133 9.08203 5.625 7.2457 5.625 4.98047C5.625 2.71524 7.46133 0.878907 9.72656 0.878907C10.0734 2.09279 11.1829 2.92969 12.4453 2.92969H16.7578C18.6994 2.92969 20.2734 4.50369 20.2734 6.44531V9.08203"
          stroke="#2473BD"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6562 17.3164V20.2148C12.6562 21.5093 13.7056 22.5586 15 22.5586C16.2944 22.5586 17.3437 21.5093 17.3437 20.2148V17.3164"
          stroke="#2473BD"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.96875 29.1211V26.1914"
          stroke="#2473BD"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.0312 29.1211V26.1914"
          stroke="#2473BD"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

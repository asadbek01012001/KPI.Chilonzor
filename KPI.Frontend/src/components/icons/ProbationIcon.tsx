interface Props {
  readonly size?: number | string | undefined;
  readonly color?: string;
}

export default function ProbationIcon({ size = 30, color = "white" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.75 25V28.7125H21.25V25H17.5V22.5H21.25V18.75H23.75V22.5H27.5V25H23.75ZM26.25 13.75C26.25 14.875 26.125 15.975 25.8875 17.0625C25.1625 16.6875 24.375 16.4375 23.5125 16.3125C23.6625 15.5625 23.75 14.7875 23.75 14.025V7.875L15 3.975L6.25 7.875V14.025C6.25 19.425 10.3125 25 15 26.25L15.3875 26.1375C15.625 26.9125 16.0375 27.6375 16.525 28.275L15 28.75C8.55 27.175 3.75 20.6875 3.75 13.75V6.25L15 1.25L26.25 6.25V13.75Z"
        fill={color}
      />
    </svg>
  );
}

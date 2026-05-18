interface Props {
  readonly size?: number | string | undefined;
  readonly color?: string;
}

export default function DeleteIcon({ size = 24, color = "white" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="27"
        height="27"
        rx="5.5"
        fill={color}
        fill-opacity="0.2"
      />
      <rect x="0.5" y="0.5" width="27" height="27" rx="5.5" stroke={color} />
      <path
        d="M11.75 6.25H16.25M7.25 9.5H20.75M19.25 9.5L18.724 17.3895C18.6451 18.5732 18.6057 19.165 18.35 19.6138C18.1249 20.0088 17.7854 20.3265 17.3762 20.5248C16.9115 20.75 16.3183 20.75 15.132 20.75H12.868C11.6817 20.75 11.0885 20.75 10.6238 20.5248C10.2146 20.3265 9.87507 20.0088 9.64999 19.6138C9.39433 19.165 9.35488 18.5732 9.27596 17.3895L8.75 9.5M12.5 12.875V16.625M15.5 12.875V16.625"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

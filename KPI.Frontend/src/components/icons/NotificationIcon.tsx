interface Props {
    readonly size?: number | string | undefined;
    readonly color?: string;
    readonly className?: string;
}

export default function NotificationIcon({ size = 20, color = "white", className }: Props) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 22"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path d="M14.1235 12.0799C14.1026 12.0799 14.0833 12.0833 14.0625 12.0833C10.5179 12.0833 7.63398 9.09256 7.63398 5.41672C7.63398 3.97247 8.08393 2.6384 8.83933 1.54495V0.833282C8.83933 0.372467 8.47929 0 8.03566 0C7.59219 0 7.23214 0.372467 7.23214 0.833282V1.7334C4.51038 2.14005 2.41071 4.56757 2.41071 7.5V9.8233C2.41071 11.4725 1.71401 13.0292 0.491736 14.1008C0.179214 14.3784 0 14.7816 0 15.2083C0 16.0126 0.630782 16.6667 1.4062 16.6667H14.6651C15.4407 16.6667 16.0715 16.0126 16.0715 15.2083C16.0715 14.7816 15.8923 14.3784 15.5716 14.0942C14.9384 13.5384 14.4499 12.8467 14.1235 12.0799Z" fill="white" />
        </svg>
    );
}

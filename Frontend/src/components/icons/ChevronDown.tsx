interface Props {
    readonly size?: number | string | undefined;
    readonly color?: string;
    readonly className?: string;
}

export default function ChevronDown({ size = 20, color = "white", className }: Props) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 22"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >

            <path d="M5.62939 6L0.000229406 -1.06691e-07L11.2586 8.77544e-07L5.62939 6Z" />
        </svg>
    );
}